import { useEffect, useState, useRef } from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  Spinner,
  useToast,
  IconButton,
  Tooltip,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import ProductoSelector from "./pageFormPedidos/productoSelector";
import CantidadInput from "./pageFormPedidos/cantidadInput";
import {
  addNewDetalleOrden,
  deleteDetalleOrden,
  getPedidosComunesByUsuarioId,
  getDetalleOrdenByPedidoId,
  updateDetalleOrden,
} from "../../../store/Pedidos/DetallePedidos/thunks";
import PropTypes from "prop-types";

const MotionBox = motion(Box);

const ProductosTable = ({ pedidoId, deudorId, tiendaId }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [detallesCargados, setDetallesCargados] = useState(false);
  const [productosComunesCargados, setProductosComunesCargados] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetFields, setResetFields] = useState(false);
  const hasLoadedProductosComunes = useRef(false);
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
      })
    );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadDetalles = async () => {
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

      setIsLoading(true);
      try {
        const detallesRaw = await dispatch(
          getDetalleOrdenByPedidoId(pedidoId)
        ).unwrap();

        const detalles = detallesRaw.map((d) => ({
          ...d,
          detallePedidoId: d.id,
        }));

        setProductos(ordenarPorNombre(detalles));
        sessionStorage.setItem(
          `productos_${pedidoId}`,
          JSON.stringify(detalles)
        );
      } catch (err) {
        console.error("Error al obtener detalles del servidor:", err);
        const cache = sessionStorage.getItem(`productos_${pedidoId}`);
        if (cache) {
          setProductos(JSON.parse(cache));
          toast({
            title: "Cargado desde cache",
            description:
              "No se pudo obtener datos del servidor, usando cache local.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Error",
            description: "No se pudieron cargar los detalles del pedido.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } finally {
        setIsLoading(false);
        setDetallesCargados(true);
      }
    };

    if (deudorId && pedidoId && tiendaId && !detallesCargados) {
      loadDetalles();
    }
  }, [deudorId, pedidoId, tiendaId, detallesCargados, dispatch, toast]);

  useEffect(() => {
    if (detallesCargados && !hasLoadedProductosComunes.current) {
      if (productos.length === 0) {
        cargarProductosComunes();
      }
      hasLoadedProductosComunes.current = true;
    }
  }, [detallesCargados]);

  useEffect(() => {
    setDetallesCargados(false);
    setProductosComunesCargados(false);
    hasLoadedProductosComunes.current = false;
    setProductos([]);
  }, [pedidoId]);

  const cargarProductosComunes = async () => {
    if (productosComunesCargados) return;
    setIsLoading(true);

    try {
      const comunesRaw = await dispatch(
        getPedidosComunesByUsuarioId({ deudorId, pedidoId, tiendaId })
      ).unwrap();
      const comunes = comunesRaw.map((c) => ({
        ...c,
        detallePedidoId: c.detallePedidoId ?? c.id,
      }));

      setProductos((prev) => {
        const nuevos = [
          ...prev,
          ...comunes.filter(
            (c) => !prev.some((p) => p.detallePedidoId === c.detallePedidoId)
          ),
        ];
        sessionStorage.setItem(`productos_${pedidoId}`, JSON.stringify(nuevos));
        return nuevos;
      });

      toast({
        title:
          comunes.length > 0
            ? "Productos comunes agregados"
            : "Sin productos comunes",
        description:
          comunes.length > 0
            ? "Los productos comunes ya están en el pedido."
            : "No se encontraron productos comunes.",
        status: comunes.length > 0 ? "success" : "info",
        duration: 3000,
        isClosable: true,
      });

      setProductosComunesCargados(true);
    } catch (err) {
      console.error("Error al cargar comunes:", err);
      toast({
        title: "Error",
        description: "Hubo un problema al obtener los productos comunes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductoChange = (
    productoId,
    nombreProducto,
    cantidadDisponible,
    codigo
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
      (prod) => prod.productoId === newProducto.productoId
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
          addNewDetalleOrden(newDetalleOrden)
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
        setProductos(nuevosProductos);

        sessionStorage.setItem(
          `productos_${pedidoId}`,
          JSON.stringify(nuevosProductos)
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
        (prod) => prod.detallePedidoId !== detallePedidoId
      );
      setProductos(productosActualizados);
      sessionStorage.setItem(
        `productos_${pedidoId}`,
        JSON.stringify(productosActualizados)
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
    setProductos((prev) =>
      prev.map((p) =>
        p.detallePedidoId === detalleId ? { ...p, cantidad } : p
      )
    );
    try {
      await dispatch(
        updateDetalleOrden({ id: detalleId, pedidoId, cantidad })
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
  const subtextColor = useColorModeValue("gray.500", "gray.400");
  const addBoxBg = useColorModeValue("teal.50", "teal.900");

  return (
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
            Detalles del Pedidooo
          </Heading>
          {productos.length > 0 ? (
            isMobile ? (
              <VStack spacing={1} align="stretch">
                {productos.map((producto) => (
                  <MotionBox
                    key={getUniqueKey(producto)}
                    p={2}
                    boxShadow="sm"
                    borderWidth="1px"
                    rounded="md"
                    bg={mobileCardBg}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HStack justifyContent="space-between" spacing={2}>
                      <Box flex="1">
                        <Text fontWeight="bold" fontSize="sm">
                          {producto.nombreProducto || "N/A"}
                        </Text>
                        {/* <Text fontSize="xs" color={subtextColor}>
                          Cantidad Máxima:{" "}
                          {producto.cantidadDisponible || "N/A"}
                        </Text> */}
                        <CantidadInput
                          value={producto.cantidad}
                          onChange={(e) =>
                            setProductos((prevProductos) =>
                              prevProductos.map((prod) =>
                                prod.detallePedidoId ===
                                producto.detallePedidoId
                                  ? {
                                      ...prod,
                                      cantidad: parseFloat(e.target.value) || 0,
                                    }
                                  : prod
                              )
                            )
                          }
                          onBlur={() => {
                            handleCantidadChange(
                              producto.detallePedidoId,
                              producto.cantidad
                            );
                          }}
                          placeholder="0"
                          size="sm"
                          width="60px"
                          maxWidth="60px"
                        />
                      </Box>
                      <Tooltip label="Eliminar producto" hasArrow>
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() =>
                            handleRemoveProducto(producto.detallePedidoId)
                          }
                          size="xs"
                        />
                      </Tooltip>
                    </HStack>
                  </MotionBox>
                ))}
              </VStack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Código</Th>
                    <Th>Producto</Th>
                    <Th>Cantidad Máxima</Th>
                    <Th>Cantidad</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {productos.map((producto) => (
                    <Tr
                      key={getUniqueKey(producto)}
                      style={{ padding: "0px", height: "10px" }}
                    >
                      <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
                        {producto.codigo || "Sin código"}
                      </Td>
                      <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
                        {producto.nombreProducto}
                      </Td>
                      <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
                        {producto.cantidadDisponible}
                      </Td>
                      <Td style={{ padding: "2px 4px", fontSize: "0.85rem" }}>
                        <CantidadInput
                          value={producto.cantidad}
                          onChange={(e) =>
                            setProductos((prevProductos) =>
                              prevProductos.map((prod) =>
                                prod.detallePedidoId ===
                                producto.detallePedidoId
                                  ? {
                                      ...prod,
                                      cantidad: Math.min(
                                        parseFloat(e.target.value) || 0,
                                        producto.cantidadDisponible
                                      ),
                                    }
                                  : prod
                              )
                            )
                          }
                          onBlur={() => {
                            handleCantidadChange(
                              producto.detallePedidoId,
                              producto.cantidad
                            );
                          }}
                          placeholder="0"
                          size="sm"
                          width="50px"
                          maxWidth="50px"
                          style={{
                            margin: "0",
                            padding: "1px",
                            fontSize: "0.85rem",
                          }}
                        />
                      </Td>
                      <Td style={{ padding: "2px 4px" }}>
                        <Tooltip label="Eliminar producto" hasArrow>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            onClick={() =>
                              handleRemoveProducto(producto.detallePedidoId)
                            }
                            size="xs"
                            style={{ margin: "0", padding: "0" }}
                          />
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )
          ) : (
            <Text textAlign="center" color="gray.500" fontSize="sm">
              No hay productos añadidos.
            </Text>
          )}

          <Box mt={4}>
            <MotionBox
              p={2}
              boxShadow="sm"
              borderWidth="1px"
              rounded="md"
              bg={addBoxBg}
              w={{ base: "full", md: "680px" }}
              mx={{ base: 0, md: "auto" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HStack spacing={2} justifyContent="space-between">
                <ProductoSelector
                  deudorId={Number(deudorId)}
                  onSelect={(
                    productoId,
                    nombreProducto,
                    cantidadDisponible,
                    codigo
                  ) =>
                    handleProductoChange(
                      productoId,
                      nombreProducto,
                      cantidadDisponible,
                      codigo
                    )
                  }
                  reset={resetFields}
                />
                <CantidadInput
                  value={newProducto.cantidad}
                  onChange={(e) =>
                    setNewProducto({
                      ...newProducto,
                      // cantidad: parseFloat(e.target.value) || 0,
                      cantidad:
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                    })
                  }
                  placeholder="0"
                  size="sm"
                  width="60px"
                  maxWidth="60px"
                />
                <Tooltip label="Agregar producto" hasArrow>
                  <IconButton
                    icon={<AddIcon />}
                    colorScheme="teal"
                    onClick={handleAddProducto}
                    size="sm"
                  />
                </Tooltip>
              </HStack>
            </MotionBox>
          </Box>
        </>
      )}
    </Box>
  );
};

ProductosTable.propTypes = {
  pedidoId: PropTypes.number.isRequired,
  deudorId: PropTypes.number.isRequired,
  tiendaId: PropTypes.number.isRequired,
};

export default ProductosTable;
