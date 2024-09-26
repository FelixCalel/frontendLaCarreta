import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Button } from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import ProductoSelector from "./productoSelector";
import CantidadInput from "./cantidadInput";
import PrecioInput from "./precioInput";
import { addNewDetalleOrden, getDetalleOrdenByPedidoId, deleteDetalleOrden } from "../../../store/Pedidos/DetallePedidos/thunks";
import PropTypes from "prop-types";

const ProductosTable = ({ pedidoId }) => {
  const dispatch = useDispatch();

  // Estado para manejar productos
  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    productoId: "",
    nombreProducto: "",
    cantidad: 0,
    precio: 0,
  });

  // Cargar productos del pedido específico al montar el componente
  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
        setProductos(detalles); // Actualizamos el estado con los productos del pedido específico
      } catch (error) {
        console.error("Error al cargar los detalles del pedido:", error);
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
    if (newProducto.productoId && newProducto.cantidad > 0 && newProducto.precio > 0) {
      try {
        const newDetalleOrden = {
          pedidoId,
          productoId: newProducto.productoId,
          cantidad: newProducto.cantidad,
          precio: newProducto.precio,
        };

        // Guardar el producto en la base de datos
        const savedDetalle = await dispatch(addNewDetalleOrden(newDetalleOrden)).unwrap();

        // Actualizar el estado local con el nuevo producto
        setProductos((prevProductos) => [...prevProductos, { ...newProducto, id: savedDetalle.id }]);
        setNewProducto({ productoId: "", nombreProducto: "", cantidad: 0, precio: 0 });
      } catch (error) {
        console.error("Error al guardar el detalle del pedido:", error);
      }
    }
  };

  // Eliminar producto del estado y de la base de datos
  const handleRemoveProducto = async (productoId, index) => {
    try {
      // Eliminar el producto de la base de datos
      await dispatch(deleteDetalleOrden(productoId)).unwrap();

      // Actualizar el estado local para reflejar la eliminación
      setProductos((prevProductos) => prevProductos.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error al eliminar el detalle del pedido:", error);
    }
  };

  // Calcular el total de los precios
  const totalPrecio = productos.reduce((total, producto) => total + parseFloat(producto.precio || 0), 0);

  return (
    <>
      <Table variant="striped" colorScheme="gray" mt={4}>
        <Thead>
          <Tr>
            <Th>Producto</Th>
            <Th>Cantidad</Th>
            <Th>Precio</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productos.map((producto, index) => (
            <Tr key={producto.id || index}>
              <Td>{producto.nombreProducto}</Td>
              <Td>{producto.cantidad}</Td>
              <Td>{producto.precio}</Td>
              <Td>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleRemoveProducto(producto.id, index)} // Pasamos el id del producto
                  size="sm"
                />
              </Td>
            </Tr>
          ))}
          <Tr>
            <Td>
              <ProductoSelector
                onSelect={(productoId, nombreProducto) => handleProductoChange(productoId, nombreProducto)}
                value={newProducto.productoId}
              />
            </Td>
            <Td>
              <CantidadInput
                value={Number(newProducto.cantidad) || 0}
                onChange={(e) => setNewProducto({ ...newProducto, cantidad: parseFloat(e.target.value) })}
              />
            </Td>
            <Td>
              <PrecioInput
                value={Number(newProducto.precio) || 0}
                onChange={(e) => setNewProducto({ ...newProducto, precio: parseFloat(e.target.value) })}
              />
            </Td>
            <Td>
              <IconButton
                icon={<AddIcon />}
                colorScheme="green"
                onClick={handleAddProducto} // Acción para guardar en la DB
                size="sm"
              />
            </Td>
          </Tr>
          {/* Fila para mostrar el total del precio */}
          <Tr>
            <Td colSpan={2} textAlign="right">
              <strong>Total:</strong>
            </Td>
            <Td>
              <strong>{totalPrecio}</strong> {/* Mostrar el total sumado */}
            </Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
      <Button colorScheme="blue" mt={4}>
        Guardar Productos
      </Button>
    </>
  );
};

// Add PropTypes validation
ProductosTable.propTypes = {
  pedidoId: PropTypes.number.isRequired,
};

export default ProductosTable;
