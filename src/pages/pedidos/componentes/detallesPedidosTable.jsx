import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Button } from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import ProductoSelector from "./productoSelector";
import CantidadInput from "./cantidadInput";
import PrecioInput from "./precioInput";
import { addNewDetalleOrden } from "../../../store/Pedidos/DetallePedidos/thunks";
import PropTypes from 'prop-types';  // <-- Importing PropTypes

const ProductosTable = ({ pedidoId }) => {
  const dispatch = useDispatch();
  
  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    productoId: "",
    cantidad: 0,
    precio: 0,
  });

  const handleProductoChange = (field, value) => {
    setNewProducto((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProducto = () => {
    if (newProducto.productoId && newProducto.cantidad > 0 && newProducto.precio > 0) {
      setProductos((prevProductos) => [...prevProductos, newProducto]);
      setNewProducto({ productoId: "", cantidad: 0, precio: 0 });
    }
  };

  const handleRemoveProducto = (index) => {
    setProductos((prevProductos) => prevProductos.filter((_, i) => i !== index));
  };

  const handleSaveDetalleOrden = async () => {
    for (const producto of productos) {
      const newDetalleOrden = {
        pedidoId,
        productoId: producto.productoId,
        cantidad: producto.cantidad,
        precio: producto.precio,
      };

      try {
        await dispatch(addNewDetalleOrden(newDetalleOrden)).unwrap();
        console.log("Detalle de producto guardado:", newDetalleOrden);
      } catch (error) {
        console.error("Error al guardar el detalle del pedido:", error);
      }
    }
  };

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
            <Tr key={index}>
              <Td>{producto.nombreProducto}</Td>
              <Td>{producto.cantidad}</Td>
              <Td>{producto.precio}</Td>
              <Td>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleRemoveProducto(index)}
                  size="sm"
                />
              </Td>
            </Tr>
          ))}
          <Tr>
            <Td>
              <ProductoSelector
                onSelect={(productoId) => handleProductoChange("productoId", productoId)}
                value={newProducto.productoId}
              />
            </Td>
            <Td>
              <CantidadInput
                value={Number(newProducto.cantidad) || 0}
                onChange={(e) => handleProductoChange("cantidad", parseFloat(e.target.value))}
              />
            </Td>
            <Td>
              <PrecioInput
                value={Number(newProducto.precio) || 0}
                onChange={(e) => handleProductoChange("precio", parseFloat(e.target.value))}
              />
            </Td>
            <Td>
              <IconButton
                icon={<AddIcon />}
                colorScheme="green"
                onClick={handleAddProducto}
                size="sm"
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>

    
    </>
  );
};

// Add PropTypes validation
ProductosTable.propTypes = {
  pedidoId: PropTypes.number.isRequired,
};

export default ProductosTable;
