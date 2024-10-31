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
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import ProductoSelector from "./productoSelector";
import CantidadInput from "./cantidadInput";
import {
  addNewDetalleOrden,
  getDetalleOrdenByPedidoId,
  deleteDetalleOrden,
  getPedidosComunesByUsuarioId,
  updateDetalleOrden,
} from "../../../store/Pedidos/DetallePedidos/thunks";
import PropTypes from "prop-types";

// Componente Motion para animaciones
const MotionBox = motion(Box);

const ProductosTable = ({ pedidoId, usuarioId }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidad: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        setIsLoading(true);
        const detalles = await dispatch(
          getDetalleOrdenByPedidoId(pedidoId)
        ).unwrap();

        if (detalles.length === 0) {
          const productosComunes = await dispatch(
            getPedidosComunesByUsuarioId(usuarioId)
          ).unwrap();
          setProductos(
            productosComunes.map((prod) => ({
              ...prod,
              cantidad: 0, // Inicializamos cantidad editable en 0
            }))
          );
        } else {
          setProductos(detalles);
        }
      } catch (error) {
        console.error("Error al cargar los detalles del pedido:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarDetalles();
  }, [dispatch, pedidoId, usuarioId]);

  const handleProductoChange = (productoId, nombreProducto) => {
    setNewProducto((prev) => ({
      ...prev,
      productoId,
      nombreProducto,
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
    // Actualizar el estado local para que el cambio sea inmediato en la interfaz
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === detalleId // Cambiar a `producto.id` en lugar de `producto.productoId`
          ? { ...producto, cantidad }
          : producto
      )
    );

    // Llamar a la API para actualizar la cantidad en el backend
    try {
      await dispatch(updateDetalleOrden({ id: detalleId, cantidad })).unwrap(); // Asegurarse de pasar `detalleId`
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
          <VStack spacing={1} align="stretch">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <MotionBox
                  key={producto.id} // Usar `producto.id` aquí
                  p={1}
                  boxShadow="sm"
                  borderWidth="1px"
                  rounded="md"
                  bg="gray.50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HStack justifyContent="space-between" spacing={1}>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">
                      {`${producto.codigo} - ${producto.nombreProducto}`}
                      </Text>
                      <CantidadInput
                        value={producto.cantidad}
                        onChange={(e) =>
                          setProductos((prevProductos) =>
                            prevProductos.map((prod) =>
                              prod.id === producto.id
                                ? {
                                    ...prod,
                                    cantidad: parseFloat(e.target.value) || 0,
                                  }
                                : prod
                            )
                          )
                        }
                        onBlur={() =>
                          handleCantidadChange(
                            producto.id, // Pasar el `id` del detalle aquí
                            producto.cantidad
                          )
                        }
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
                        onClick={() => handleRemoveProducto(producto.id)} // Usar `producto.id` en lugar de `producto.productoId`
                        size="xs"
                      />
                    </Tooltip>
                  </HStack>
                </MotionBox>
              ))
            ) : (
              <Text textAlign="center" color="gray.500" fontSize="sm">
                No hay productos añadidos.
              </Text>
            )}

            <MotionBox
              p={1}
              boxShadow="sm"
              borderWidth="1px"
              rounded="md"
              bg="teal.50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HStack spacing={1} justifyContent="space-between">
                <ProductoSelector
                  onSelect={handleProductoChange}
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
