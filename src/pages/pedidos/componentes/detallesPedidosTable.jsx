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

const ProductosTable = ({ pedidoId, usuarioId }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [productos, setProductos] = useState([]);
  const [productosCargados, setProductosCargados] = useState(false);

  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidad: 0,
    cantidadDisponible: 0,
    codigo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  useEffect(() => {
    const cargarDetallesPedido = async () => {
      try {
        setIsLoading(true);

        // Verificar si los detalles del pedido están en sessionStorage
        const detallesGuardados = sessionStorage.getItem(
          `productos_${pedidoId}`
        );

        if (detallesGuardados) {
          const detallesGuardadosParsed = JSON.parse(detallesGuardados);
          setProductos(detallesGuardadosParsed);
          setProductosCargados(true);
          setIsLoading(false);
          return;
        }

        // Cargar solo los detalles del pedido desde la API
        const detalles = await dispatch(
          getDetalleOrdenByPedidoId(pedidoId)
        ).unwrap();

        setProductos(detalles);
        setProductosCargados(true);

        // Guardar en sessionStorage
        sessionStorage.setItem(
          `productos_${pedidoId}`,
          JSON.stringify(detalles)
        );
      } catch (error) {
        console.error("Error al cargar los detalles del pedido:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (usuarioId && pedidoId && !productosCargados) {
      cargarDetallesPedido();
    }
  }, [dispatch, usuarioId, pedidoId, productosCargados]);

  useEffect(() => {
    const cargarProductosComunes = async () => {
      try {
        setIsLoading(true);

        // Verificar si los productos ya están en sessionStorage
        const productosGuardados = sessionStorage.getItem(
          `productos_${pedidoId}`
        );
        if (productosGuardados) {
          const productosGuardadosParsed = JSON.parse(productosGuardados);
          setProductos(productosGuardadosParsed);
          setProductosCargados(true);
          setIsLoading(false);
          return;
        }

        // Cargar los productos comunes desde la API
        const productosComunes = await dispatch(
          getPedidosComunesByUsuarioId({
            usuarioId: Number(usuarioId),
            pedidoId: Number(pedidoId),
          })
        ).unwrap();

        // Excluir productos eliminados que no deben recargarse
        const productosActualizados = productosComunes.filter(
          (prod) =>
            !productos.some(
              (producto) => producto.productoId === prod.productoId
            )
        );

        setProductos(productosActualizados);
        setProductosCargados(true);

        // Guardar en sessionStorage
        sessionStorage.setItem(
          `productos_${pedidoId}`,
          JSON.stringify(productosActualizados)
        );
      } catch (error) {
        console.error("Error al cargar los productos comunes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (usuarioId && pedidoId && !productosCargados) {
      cargarProductosComunes();
    }
  }, [dispatch, usuarioId, pedidoId, productosCargados, productos]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProductoChange = (
    productoId,
    nombreProducto,
    cantidadDisponible,
    codigo
  ) => {
    setNewProducto((prev) => ({
      ...prev,
      productoId,
      nombreProducto,
      cantidadDisponible,
      codigo,
    }));
  };

  const handleAddProducto = async () => {
    if (newProducto.productoId && newProducto.cantidad >= 0) {
      // Validar que la cantidad no exceda la cantidad disponible
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

      // **Nueva Validación**: Comprobar si el producto ya existe en la lista de detalles actuales
      const productoExistente = productos.some(
        (prod) => prod.productoId === newProducto.productoId
      );

      if (productoExistente) {
        toast({
          title: "Producto ya agregado",
          description: "Este producto ya existe en los detalles del pedido.",
          status: "warning",
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
          precio: 0, // Si hay un precio que manejar, este se debe actualizar
        };

        // Enviar el detalle del producto al backend
        const result = await dispatch(
          addNewDetalleOrden(newDetalleOrden)
        ).unwrap();
        if (!result || !result.id) {
          throw new Error("El backend no devolvió un detallePedidoId válido.");
        }

        const detalleConId = {
          ...result,
          detallePedidoId: result.id, // Mapear id a detallePedidoId
        };

        // Actualizar los productos en el estado local
        const nuevosProductos = [...productos, detalleConId];
        setProductos(nuevosProductos);

        // Guardar los datos actualizados en el sessionStorage
        sessionStorage.setItem(
          `productos_${pedidoId}`,
          JSON.stringify(nuevosProductos)
        );

        // Reiniciar el formulario para agregar un nuevo producto
        setNewProducto({
          productoId: "",
          nombreProducto: "",
          cantidad: 0,
          cantidadDisponible: 0,
          codigo: "",
        });
        setResetFields(true); // Reiniciar campos del formulario

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
      // Eliminar producto de la base de datos
      await dispatch(deleteDetalleOrden(detallePedidoId)).unwrap();

      // Actualizar la lista local de productos
      const productosActualizados = productos.filter(
        (prod) => prod.detallePedidoId !== detallePedidoId
      );
      setProductos(productosActualizados);

      // Actualizar sessionStorage con la lista actualizada
      sessionStorage.setItem(
        `productos_${pedidoId}`,
        JSON.stringify(productosActualizados)
      );

      // Mostrar mensaje de éxito
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
    if (!detalleId || !pedidoId) {
      console.error("El detalleId o pedidoId son undefined o inválidos", {
        detalleId,
        pedidoId,
      });
      return;
    }

    console.log(
      "Actualizando cantidad para detalleId:",
      detalleId,
      "con cantidad:",
      cantidad
    );

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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detección de vista móvil

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
                    key={producto.detallePedidoId}
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
                          {`${producto.codigo || "Sin código"} - ${
                            producto.nombreProducto
                          }`}
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
                          onClick={() => {
                            if (producto.detallePedidoId) {
                              handleRemoveProducto(producto.detallePedidoId);
                            } else {
                              console.error(
                                "DetallePedidoId no encontrado:",
                                producto
                              );
                            }
                          }}
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
                      key={producto.detallePedidoId}
                      style={{ padding: "0px", height: "10px" }}
                    >
                      {/* Altura de la fila ajustada */}
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
                            style={{ margin: "0", padding: "0" }} // Eliminar margen y padding adicional
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

          {/* Siempre mostrar ProductoSelector, CantidadInput y botón de agregar */}
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
                      cantidad: parseFloat(e.target.value),
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
                    onClick={() => {
                      handleAddProducto();
                      setResetFields(false);
                    }}
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
  usuarioId: PropTypes.number.isRequired,
};

export default ProductosTable;
