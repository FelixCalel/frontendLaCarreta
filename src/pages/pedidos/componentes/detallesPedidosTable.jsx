import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Button,
  Spinner,
  Box,
  Text,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import ProductoSelector from "./productoSelector";
import CantidadInput from "./cantidadInput";
import PrecioInput from "./precioInput";
import {
  addNewDetalleOrden,
  getDetalleOrdenByPedidoId,
  deleteDetalleOrden,
} from "../../../store/Pedidos/DetallePedidos/thunks";
import PropTypes from "prop-types";

// Motion Component for animations
const MotionTd = motion(Td);

const ProductosTable = ({ pedidoId }) => {
  const dispatch = useDispatch();
  const toast = useToast(); // Chakra UI toast for feedback

  // Estado para manejar productos
  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidad: 0,
    precio: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  // Cargar productos del pedido específico al montar el componente
  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        setIsLoading(true); // Show loader
        const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
        setProductos(detalles); // Actualizamos el estado con los productos del pedido específico
      } catch (error) {
        console.error("Error al cargar los detalles del pedido:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    };
    cargarDetalles();
  }, [dispatch, pedidoId]);

  // Manejar cambios en los campos del producto
  const handleProductoChange = (productoId, nombreProducto) => {
    setNewProducto((prev) => ({
      ...prev,
      productoId,
      nombreProducto,
    }));
  };

  // Añadir nuevo producto a la lista y base de datos
  const handleAddProducto = async () => {
    if (newProducto.productoId && newProducto.cantidad > 0) {
      try {
        const newDetalleOrden = {
          pedidoId,
          productoId: newProducto.productoId,
          cantidad: newProducto.cantidad,
          precio: newProducto.precio, // Permitir precio cero
        };

        // Guardar el producto en la base de datos
        await dispatch(addNewDetalleOrden(newDetalleOrden)).unwrap();

        // Volver a cargar la lista de productos después de agregar
        const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
        setProductos(detalles);

        // Limpiar los campos después de agregar el producto
        setNewProducto({
          productoId: "",
          nombreProducto: "",
          cantidad: 0,
          precio: 0,
        });
        setResetFields(true); // Indicar que se deben resetear los campos

        // Mostrar mensaje de éxito
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

  // Eliminar producto del estado y de la base de datos
  const handleRemoveProducto = async (productoId) => {
    try {
      // Eliminar el producto de la base de datos
      await dispatch(deleteDetalleOrden(productoId)).unwrap();

      // Volver a cargar la lista de productos después de eliminar
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
      setProductos(detalles);

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

  // Calcular el total de los precios
  const totalPrecio = productos.reduce(
    (total, producto) => total + parseFloat(producto.precio || 0),
    0
  );

  return (
    <Box boxShadow="lg" p="6" rounded="md" bg="white" mt={8}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <Spinner size="xl" />
        </Box>
      ) : (
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
            Detalles del Pedido
          </Text>
          <Table variant="simple" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Producto</Th>
                <Th>Cantidad</Th>
                <Th>Precio</Th>
                <Th textAlign="center">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productos.map((producto, index) => (
                <Tr
                  key={producto.id || index}
                  as={motion.tr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Td>{producto.nombreProducto}</Td>
                  <Td>{producto.cantidad}</Td>
                  <Td>{producto.precio}</Td>
                  <MotionTd textAlign="center">
                    <Tooltip label="Eliminar producto" hasArrow>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleRemoveProducto(producto.id)} // Pasamos el id del producto
                        size="sm"
                      />
                    </Tooltip>
                  </MotionTd>
                </Tr>
              ))}
              <Tr>
                <Td>
                  <ProductoSelector onSelect={handleProductoChange} reset={resetFields} />
                </Td>
                <Td>
                  <CantidadInput
                    value={newProducto.cantidad}
                    onChange={(e) =>
                      setNewProducto({
                        ...newProducto,
                        cantidad: parseFloat(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </Td>
                <Td>
                  <PrecioInput
                    value={newProducto.precio}
                    onChange={(e) =>
                      setNewProducto({
                        ...newProducto,
                        precio: parseFloat(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </Td>
                <MotionTd textAlign="center">
                  <Tooltip label="Agregar producto" hasArrow>
                    <IconButton
                      icon={<AddIcon />}
                      colorScheme="green"
                      onClick={() => {
                        handleAddProducto();
                        setResetFields(false); // Limpiar los campos después
                      }}
                      size="sm"
                    />
                  </Tooltip>
                </MotionTd>
              </Tr>
              {/* Fila para mostrar el total del precio */}
              <Tr>
                <Td colSpan={2} textAlign="right">
                  <strong>Total:</strong>
                </Td>
                <Td>
                  <strong>{totalPrecio}</strong>
                </Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};

// Add PropTypes validation
ProductosTable.propTypes = {
  pedidoId: PropTypes.number.isRequired,
};

export default ProductosTable;
