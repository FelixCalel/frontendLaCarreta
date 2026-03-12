import { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Spinner,
  useToast,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useDispatch } from "react-redux";
import { DetallesPedidosListMobile } from "./detallesPedidosTableComps/DetallesPedidosListMobile";
import { DetallesPedidosTableDesktop } from "./detallesPedidosTableComps/DetallesPedidosTableDesktop";
import { AddProductoSection } from "./detallesPedidosTableComps/AddProductoSection";
import {
  addNewDetalleOrden,
  deleteDetalleOrden,
  getPedidoModeloByUsuarioId,
  getDetalleOrdenByPedidoId,
  updateDetalleOrden,
} from "../../../store/Pedidos/DetallePedidos/thunks";
import PropTypes from "prop-types";

const MotionBox = m.create(Box);

const ProductosTable = ({ pedidoId, deudorId, tiendaId }) => {
  const addBoxBgColor = useColorModeValue("gray.100", "gray.700");
  const dispatch = useDispatch();
  const toast = useToast();
  const [dataState, setDataState] = useState({
    productos: [],
    isLoading: false,
  });
  const [resetFields, setResetFields] = useState(false);
  const hasLoadedPedidoModelo = useRef(false);
  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidad: 0,
    cantidadDisponible: 0,
    codigo: "",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const ordenarPorNombre = (arr) =>
    arr.slice().sort((a, b) =>
      (a.nombreProducto || "").localeCompare(b.nombreProducto || "", "es", {
        sensitivity: "base",
      }),
    );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      if (![deudorId, pedidoId, tiendaId].every((id) => id && !isNaN(id))) {
        toast({
          title: "Error",
          description: "Uno de los IDs no es válido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setDataState((prev) => ({ ...prev, isLoading: true }));
      try {
        // First try to load existing details
        const detallesRaw = await dispatch(
          getDetalleOrdenByPedidoId(pedidoId),
        ).unwrap();

        const detalles = detallesRaw.map((d) => ({
          ...d,
          detallePedidoId: d.id,
        }));

        let finalProductos = ordenarPorNombre(detalles);
        
        // If no details, try to load model
        if (finalProductos.length === 0) {
          try {
            const modeloRaw = await dispatch(
              getPedidoModeloByUsuarioId({ deudorId, pedidoId, tiendaId }),
            ).unwrap();
            const modelo = modeloRaw.map((c) => ({
              ...c,
              detallePedidoId: c.detallePedidoId ?? c.id,
            }));
            finalProductos = ordenarPorNombre(modelo);
            
            if (modelo.length > 0) {
              toast({
                title: "Productos activos agregados",
                description: "Los productos activos ya están en el pedido.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }
          } catch (modelErr) {
            console.error("Error al cargar pedido modelo:", modelErr);
          }
        }

        setDataState({ productos: finalProductos, isLoading: false });
        sessionStorage.setItem(
          `productos_${pedidoId}`,
          JSON.stringify(finalProductos),
        );
      } catch (err) {
        console.error("Error al obtener detalles del servidor:", err);
        const cache = sessionStorage.getItem(`productos_${pedidoId}`);
        if (cache) {
          setDataState({ productos: JSON.parse(cache), isLoading: false });
          toast({
            title: "Cargado desde cache",
            description: "No se pudo obtener datos del servidor, usando cache local.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } else {
          setDataState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    if (deudorId && pedidoId && tiendaId) {
      loadAllData();
    }
  }, [deudorId, pedidoId, tiendaId, dispatch, toast]);

  const cargarPedidoModelo = async () => {
    if (pedidoModeloCargado) return;
    setIsLoading(true);

    try {
      const modeloRaw = await dispatch(
        getPedidoModeloByUsuarioId({ deudorId, pedidoId, tiendaId }),
      ).unwrap();
      const modelo = modeloRaw.map((c) => ({
        ...c,
        detallePedidoId: c.detallePedidoId ?? c.id,
      }));

      setDataState((prev) => {
        const nuevos = [
          ...prev.productos,
          ...modelo.filter(
            (c) =>
              !prev.productos.some(
                (p) => p.detallePedidoId === c.detallePedidoId,
              ),
          ),
        ];
        sessionStorage.setItem(`productos_${pedidoId}`, JSON.stringify(nuevos));
        return { ...prev, productos: nuevos, isLoading: false };
      });

      toast({
        title:
          modelo.length > 0
            ? "Productos activos agregados"
            : "Sin productos activos",
        description:
          modelo.length > 0
            ? "Los productos activos ya están en el pedido."
            : "No se encontraron productos activos para este deudor.",
        status: modelo.length > 0 ? "success" : "info",
        duration: 3000,
        isClosable: true,
      });

      setPedidoModeloCargado(true);
    } catch (err) {
      console.error("Error al cargar pedido modelo:", err);
      toast({
        title: "Error",
        description: "Hubo un problema al obtener el pedido modelo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setDataState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const { productos, isLoading } = dataState;

  const handleProductoChange = (
    productoId,
    nombreProducto,
    cantidadDisponible,
    codigo,
  ) => {
    setNewProducto({
      productoId,
      nombreProducto,
      cantidadDisponible,
      codigo,
      cantidad: 0,
    });
  };

  const handleAddProducto = async () => {
    const productoExistente = productos.find(
      (prod) => prod.productoId === newProducto.productoId,
    );

    if (productoExistente) {
      toast({
        title: "Producto duplicado",
        description: "Este producto ya ha sido agregado al pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newProducto.productoId && newProducto.cantidad !== "") {
      if (newProducto.cantidad > newProducto.cantidadDisponible) {
        toast({
          title: "Cantidad excedida",
          description: `No puedes agregar más de ${newProducto.cantidadDisponible} unidades para este producto.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const newDetalleOrden = {
          pedidoId,
          productoId: newProducto.productoId,
          cantidad: newProducto.cantidad,
          precio: newProducto.precio || 0,
        };

        const result = await dispatch(
          addNewDetalleOrden(newDetalleOrden),
        ).unwrap();
        if (!result || !result.id) {
          throw new Error("El backend no devolvió un detallePedidoId válido.");
        }

        const nuevoProducto = {
          detallePedidoId: result.id,
          productoId: newProducto.productoId,
          nombreProducto: newProducto.nombreProducto,
          cantidadDisponible: newProducto.cantidadDisponible,
          codigo: newProducto.codigo,
          cantidad: newProducto.cantidad,
        };

        const nuevosProductos = [...productos, nuevoProducto];
        setDataState((prev) => ({
          ...prev,
          productos: nuevosProductos,
        }));

        sessionStorage.setItem(
          `productos_${pedidoId}`,
          JSON.stringify(nuevosProductos),
        );

        setNewProducto({
          productoId: "",
          nombreProducto: "",
          cantidad: 0,
          cantidadDisponible: 0,
          codigo: "",
          precio: 0,
        });

        setResetFields((prev) => !prev);

        toast({
          title: "Producto agregado",
          description: "El producto ha sido agregado exitosamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error al guardar el detalle del pedido:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al agregar el producto.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Selecciona un producto y una cantidad válida.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveProducto = async (detallePedidoId) => {
    if (!detallePedidoId) {
      console.error("DetallePedidoId no válido:", detallePedidoId);
      return;
    }

    try {
      await dispatch(deleteDetalleOrden(detallePedidoId)).unwrap();

      const productosActualizados = productos.filter(
        (prod) => prod.detallePedidoId !== detallePedidoId,
      );
      setDataState((prev) => ({
        ...prev,
        productos: productosActualizados,
      }));
      sessionStorage.setItem(
        `productos_${pedidoId}`,
        JSON.stringify(productosActualizados),
      );
      console.log("Producto eliminado:", detallePedidoId);

      toast({
        title: "Producto eliminado.",
        description: "El producto ha sido eliminado exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al eliminar el detalle del pedido:", error);
      toast({
        title: "Error.",
        description: "Hubo un problema al eliminar el producto.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCantidadChange = async (detalleId, cantidad) => {
    if (!detalleId || !pedidoId) return;
    setDataState((prev) => ({
      ...prev,
      productos: prev.productos.map((p) =>
        p.detallePedidoId === detalleId ? { ...p, cantidad } : p,
      ),
    }));
    try {
      await dispatch(
        updateDetalleOrden({ id: detalleId, pedidoId, cantidad }),
      ).unwrap();

      toast({
        title: "Cantidad actualizada",
        description: `La nueva cantidad es ${cantidad}.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getUniqueKey = (producto) => {
    return producto.detallePedidoId || producto.id || producto.productoId;
  };
  const containerBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const mobileCardBg = useColorModeValue("gray.50", "gray.700");

  return (
    <LazyMotion features={domAnimation}>
      <Box p={1} borderRadius="md" boxShadow="sm" bg={containerBg}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minH="80px"
          >
            <Spinner size="sm" />
          </Box>
        ) : (
          <>
            <Heading
              as="h3"
              size="xs"
              mb={1}
              textAlign="center"
              color={headingColor}
            >
              Detalles del Pedido
            </Heading>
            {productos.length > 0 ? (
              isMobile ? (
                <DetallesPedidosListMobile
                  productos={productos}
                  mobileCardBg={mobileCardBg}
                  getUniqueKey={getUniqueKey}
                  setProductos={setProductos}
                  handleCantidadChange={handleCantidadChange}
                  handleRemoveProducto={handleRemoveProducto}
                />
              ) : (
                <DetallesPedidosTableDesktop
                  productos={productos}
                  getUniqueKey={getUniqueKey}
                  setProductos={setProductos}
                  handleCantidadChange={handleCantidadChange}
                  handleRemoveProducto={handleRemoveProducto}
                />
              )
            ) : (
              <Text textAlign="center" color="gray.500" fontSize="sm">
                No hay productos añadidos.
              </Text>
            )}

            <AddProductoSection
              deudorId={deudorId}
              addBoxBgColor={addBoxBgColor}
              resetFields={resetFields}
              newProducto={newProducto}
              handleProductoChange={handleProductoChange}
              setNewProducto={setNewProducto}
              handleAddProducto={handleAddProducto}
            />
          </>
        )}
      </Box>
    </LazyMotion>
  );
};

ProductosTable.propTypes = {
  pedidoId: PropTypes.number.isRequired,
  deudorId: PropTypes.number.isRequired,
  tiendaId: PropTypes.number.isRequired,
};

export default ProductosTable;
