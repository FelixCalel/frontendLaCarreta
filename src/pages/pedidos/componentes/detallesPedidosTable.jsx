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
import ProductoSelector from "./productoSelector";
import CantidadInput from "./cantidadInput";
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
    const cargarProductosComunes = async () => {
      try {
        setIsLoading(true);
        const productosComunes = await dispatch(
          getPedidosComunesByUsuarioId({
            usuarioId: Number(usuarioId),
            pedidoId: Number(pedidoId),
          })
        ).unwrap();

        const mappedProducts = productosComunes.map((prod) => ({
          ...prod,
          cantidad: 0,
          cantidadDisponible: prod.cantidadDisponible,
          codigo: prod.codigo || "Sin código",
        }));

        setProductos(mappedProducts);
      } catch (error) {
        console.error("Error al cargar los productos comunes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (usuarioId && pedidoId) {
      cargarProductosComunes();
    }
  }, [dispatch, usuarioId, pedidoId]);

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
    if (newProducto.productoId && newProducto.cantidad > 0) {
      try {
        const newDetalleOrden = {
          pedidoId,
          productoId: newProducto.productoId,
          cantidad: newProducto.cantidad,
          precio: 0,
        };

        await dispatch(addNewDetalleOrden(newDetalleOrden)).unwrap();
        const detalles = await dispatch(
          getDetalleOrdenByPedidoId(pedidoId)
        ).unwrap();
        setProductos(detalles);

        setNewProducto({
          productoId: "",
          nombreProducto: "",
          cantidad: 0,
          cantidadDisponible: 0,
          codigo: "",
        });
        setResetFields(true);

        toast({
          title: "Producto agregado.",
          description: "El producto ha sido añadido exitosamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error al guardar el detalle del pedido:", error);
        toast({
          title: "Error.",
          description: "Hubo un problema al agregar el producto.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveProducto = async (productoId) => {
    try {
      await dispatch(deleteDetalleOrden(productoId)).unwrap();
      const detalles = await dispatch(
        getDetalleOrdenByPedidoId(pedidoId)
      ).unwrap();
      setProductos(detalles);

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
    try {
      await dispatch(
        updateDetalleOrden({
          id: Number(detalleId),
          pedidoId: Number(pedidoId),
          cantidad,
        })
      ).unwrap();
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);// Detección de vista móvil

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
                          Cantidad Máxima: {producto.cantidadDisponible || "N/A"}
                        </Text>
                        <CantidadInput
                          value={producto.cantidad}
                          onChange={(e) =>
                            setProductos((prevProductos) =>
                              prevProductos.map((prod) =>
                                prod.detallePedidoId === producto.detallePedidoId
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
                          width="60px"
                          maxWidth="60px"
                          max={producto.cantidadDisponible}
                        />
                      </Box>
                      <Tooltip label="Eliminar producto" hasArrow>
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() =>
                            handleRemoveProducto(producto.productoId)
                          }
                          size="xs"
                        />
                      </Tooltip>
                    </HStack>
                  </MotionBox>
                ))}
  
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
                    <Tr key={producto.detallePedidoId}>
                      <Td>{producto.codigo || "Sin código"}</Td>
                      <Td>{producto.nombreProducto}</Td>
                      <Td>{producto.cantidadDisponible}</Td>
                      <Td>
                        <CantidadInput
                          value={producto.cantidad}
                          onChange={(e) =>
                            setProductos((prevProductos) =>
                              prevProductos.map((prod) =>
                                prod.detallePedidoId === producto.detallePedidoId
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
                          width="60px"
                          maxWidth="60px"
                          max={producto.cantidadDisponible}
                        />
                      </Td>
                      <Td>
                        <Tooltip label="Eliminar producto" hasArrow>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            onClick={() =>
                              handleRemoveProducto(producto.productoId)
                            }
                            size="xs"
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
