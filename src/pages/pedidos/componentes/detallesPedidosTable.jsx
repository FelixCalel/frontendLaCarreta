// ProductosTable.jsx
import { useEffect, useState } from "react";
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
    useState(false); // Nueva bandera
  const [isLoading, setIsLoading] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidad: 0,
    cantidadDisponible: 0,
    codigo: "",
  });

  // Manejo de responsividad
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Primer useEffect: Cargar detalles del pedido
  useEffect(() => {
    const cargarDetallesPedido = async () => {
      try {
        // Validar que todos los IDs sean válidos
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
        console.log("Intentando cargar detalles del pedido...");

        // Verificar si los detalles ya están en sessionStorage
        const detallesGuardados = sessionStorage.getItem(
          `productos_${pedidoId}`
        );
        if (detallesGuardados) {
          const detallesParsed = JSON.parse(detallesGuardados);
          setProductos(detallesParsed);
          setDetallesCargados(true);
          console.log(
            "Detalles cargados desde sessionStorage:",
            detallesParsed
          );
          setIsLoading(false);
          return; // No hacer más acciones si ya tenemos los detalles
        }

        // Intentar cargar los detalles del pedido desde el backend
        try {
          const detalles = await dispatch(
            getDetalleOrdenByPedidoId(pedidoId)
          ).unwrap();
          if (detalles.length > 0) {
            setProductos(detalles);
            sessionStorage.setItem(
              `productos_${pedidoId}`,
              JSON.stringify(detalles)
            );
            console.log("Detalles cargados desde backend:", detalles);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Pedido sin detalles, proceder a cargar productos comunes
            console.warn("No se encontraron detalles para el pedido (404).");
          }
        } finally {
          setDetallesCargados(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error en cargarDetallesPedido:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al procesar los detalles del pedido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    if (deudorId && pedidoId && tiendaId && !detallesCargados) {
      cargarDetallesPedido();
    }
  }, [deudorId, pedidoId, tiendaId, detallesCargados, toast, dispatch]);

  // Segundo useEffect: Cargar productos comunes si no hay detalles
  useEffect(() => {
    const cargarProductosComunes = async () => {
      try {
        setIsLoading(true);
        console.log("Intentando cargar productos comunes...");

        // Verificar nuevamente los IDs por seguridad
        if (![deudorId, pedidoId, tiendaId].every((id) => id && !isNaN(id))) {
          toast({
            title: "Error",
            description: "Uno de los IDs no es válido.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }

        // Obtener los productos comunes
        const productosComunes = await dispatch(
          getPedidosComunesByUsuarioId({ deudorId, pedidoId, tiendaId })
        ).unwrap();

        console.log("Productos comunes recibidos:", productosComunes);

        if (productosComunes.length > 0) {
          const nuevosProductos = [];

          // Agregar cada producto común al pedido
          for (const producto of productosComunes) {
            const newDetalleOrden = {
              pedidoId,
              productoId: producto.productoId,
              cantidad: producto.cantidad || 1,
              precio: producto.precio || 0,
            };
            const result = await dispatch(
              addNewDetalleOrden(newDetalleOrden)
            ).unwrap();
            if (!result || !result.id) {
              throw new Error(
                "El backend no devolvió un detallePedidoId válido."
              );
            }
            const nuevoProducto = {
              detallePedidoId: result.id,
              productoId: producto.productoId,
              nombreProducto: producto.nombreProducto,
              cantidadDisponible: producto.cantidadDisponible,
              codigo: producto.codigo,
              cantidad: newDetalleOrden.cantidad,
            };
            nuevosProductos.push(nuevoProducto);
            console.log("Producto común agregado:", nuevoProducto);
          }

          // Actualizar el estado de productos con los nuevos productos comunes
          setProductos(nuevosProductos);
          console.log("Productos después de agregar comunes:", nuevosProductos);

          // Actualizar sessionStorage con los nuevos productos
          sessionStorage.setItem(
            `productos_${pedidoId}`,
            JSON.stringify(nuevosProductos)
          );

          toast({
            title: "Productos comunes agregados",
            description: "Los productos comunes han sido agregados al pedido.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          // Si no hay productos comunes, mostrar mensaje
          toast({
            title: "Sin productos comunes",
            description:
              "No se encontraron productos comunes para este pedido.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }

        setProductosComunesCargados(true); // Actualizar la bandera
      } catch (error) {
        console.error("Error al cargar los productos comunes:", error);
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

    // Cargar productos comunes solo si los detalles ya fueron cargados y están vacíos
    if (
      detallesCargados &&
      productos.length === 0 &&
      !productosComunesCargados
    ) {
      cargarProductosComunes();
    }
  }, [
    detallesCargados,
    productos.length,
    productosComunesCargados,
    deudorId,
    pedidoId,
    tiendaId,
    dispatch,
    toast,
  ]);

  // Manejo de cambio de producto seleccionado
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
      cantidad: 0, // Reiniciar cantidad al cambiar el producto
    });
  };

// Manejo de agregar producto
const handleAddProducto = async () => {
  // Verificación de producto duplicado
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

  if (newProducto.productoId && newProducto.cantidad > 0) {
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

      const result = await dispatch(addNewDetalleOrden(newDetalleOrden)).unwrap();
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
      
      // Actualizar sessionStorage
      sessionStorage.setItem(
        `productos_${pedidoId}`,
        JSON.stringify(nuevosProductos)
      );

      // Resetear el estado de newProducto
      setNewProducto({
        productoId: "",
        nombreProducto: "",
        cantidad: 0,
        cantidadDisponible: 0,
        codigo: "",
        precio: 0,
      });

      // Activar el reset del selector de productos
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

  // Manejo de eliminar producto
  const handleRemoveProducto = async (detallePedidoId) => {
    if (!detallePedidoId) {
      console.error("DetallePedidoId no válido:", detallePedidoId);
      return;
    }

    try {
      // Eliminar el producto desde el backend
      await dispatch(deleteDetalleOrden(detallePedidoId)).unwrap();

      // Eliminar de sessionStorage y actualizar el estado local
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

  // Manejo de cambiar cantidad de producto
  const handleCantidadChange = async (detalleId, cantidad) => {
    if (!detalleId || !pedidoId) {
      console.error("El detalleId o pedidoId son undefined o inválidos", {
        detalleId,
        pedidoId,
      });
      return;
    }

    try {
      await dispatch(
        updateDetalleOrden({
          id: Number(detalleId),
          pedidoId: Number(pedidoId),
          cantidad,
        })
      ).unwrap();

      const productosActualizados = productos.map((prod) =>
        prod.detallePedidoId === detalleId ? { ...prod, cantidad } : prod
      );
      setProductos(productosActualizados);
      sessionStorage.setItem(
        `productos_${pedidoId}`,
        JSON.stringify(productosActualizados)
      );
      console.log(
        `Cantidad actualizada para detalle ${detalleId}: ${cantidad}`
      );

      toast({
        title: "Cantidad actualizada.",
        description: "La cantidad del producto se ha actualizado exitosamente.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      toast({
        title: "Error.",
        description: "No se pudo actualizar la cantidad del producto.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Función para manejar la asignación de claves únicas
  const getUniqueKey = (producto) => {
    return producto.detallePedidoId || producto.id || producto.productoId;
  };

  return (
    <Box p={1} borderRadius="md" boxShadow="sm" bg="white">
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
          <Heading as="h3" size="xs" mb={1} textAlign="center" color="teal.600">
            Detalles del Pedido
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
                    bg="gray.50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HStack justifyContent="space-between" spacing={2}>
                      <Box flex="1">
                        <Text fontWeight="bold" fontSize="sm">
                         Nombre Prodcuto:{" "}
                          {producto.nombreProducto || "N/A" }
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Cantidad Máxima:{" "}
                          {producto.cantidadDisponible || "N/A"}
                        </Text>
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
                          placeholder="Cantidad"
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
                          placeholder="Cantidad"
                          size="sm"
                          width="50px"
                          maxWidth="50px"
                          max={producto.cantidadDisponible}
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
              bg="teal.50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HStack spacing={2} justifyContent="space-between">
                <ProductoSelector
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
                      cantidad: parseFloat(e.target.value) || 0,
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
