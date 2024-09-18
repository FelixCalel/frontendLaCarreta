import { useState, useEffect } from "react";
import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Collapse,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import ProductoSelector from "./componentes/productoSelector";
import CantidadInput from "./componentes/cantidadInput";
import PrecioInput from "./componentes/precioInput";
import DeuSelector from "./componentes/DeuSelector";
import CiudadSelector from "./componentes/CiudadSelector";
import TiendaSelector from "./componentes/tiendaSelector";
import { addNewDetalleOrden, tablaDetalleOrden } from "../../store/Pedidos/DetallePedidos/thunks";
import { addNewPedido, tablaPedidos} from "../../store/Pedidos/thunks"
const DetallePedidoForm = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Obtenemos pedidos y detalleOrden desde Redux
  const pedidos = useSelector((state) => state.pedidos.data); 
  const detalleOrden = useSelector((state) => state.detalleOrden.data);

  const [detallePedido, setDetallePedido] = useState({
    ciudadId: "",
    deudorId: "",
    tiendaId: "",
    productos: [], 
  });

  const [isPedidoFinalizado, setIsPedidoFinalizado] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState({}); 
  const [pedidoIdGuardado, setPedidoIdGuardado] = useState(null);

  const [producto, setProducto] = useState({
    productoId: "",
    cantidad: 0,
    precio: 0,
  });

  useEffect(() => {
    dispatch(tablaPedidos()); 
    dispatch(tablaDetalleOrden()); 
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCiudadChange = (e) => {
    const { value } = e.target;
    setDetallePedido((prev) => ({
      ...prev,
      ciudadId: value,
    }));
  };

  const handleDeudorSelect = (deudorId) => {
    setDetallePedido((prev) => ({
      ...prev,
      deudorId,
    }));
  };

  const handleTiendaChange = (e) => {
    const { value } = e.target;
    setDetallePedido((prev) => ({
      ...prev,
      tiendaId: value,
    }));
  };

  const handleProductoSelect = (productoId) => {
    setProducto((prev) => ({
      ...prev,
      productoId,
    }));
  };

  const validateFields = () => {
    let formErrors = {};
    if (!detallePedido.ciudadId && !isPedidoFinalizado) formErrors.ciudadId = "La ciudad es obligatoria";
    if (!detallePedido.deudorId && !isPedidoFinalizado) formErrors.deudorId = "El deudor es obligatorio";
    if (!detallePedido.tiendaId && !isPedidoFinalizado) formErrors.tiendaId = "La tienda es obligatoria";
    if (!producto.productoId) formErrors.productoId = "El producto es obligatorio";
    if (producto.cantidad <= 0) formErrors.cantidad = "La cantidad debe ser mayor a 0";
    if (producto.precio <= 0) formErrors.precio = "El precio debe ser mayor a 0";
    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      console.log(formErrors);
      return;
    }

    if (!isPedidoFinalizado) {
      // Crear el pedido maestro (Ciudad, Deudor, Tienda)
      const newPedido = {
        ciudadId: detallePedido.ciudadId,
        deudorId: detallePedido.deudorId,
        tiendaId: detallePedido.tiendaId,
      };

      // Despachamos el thunk para guardar el pedido en la base de datos
      const pedidoGuardado = await dispatch(addNewPedido(newPedido)).unwrap();
      
      // Guardar el ID del pedido creado en la base de datos
      setPedidoIdGuardado(pedidoGuardado.id);

      setIsPedidoFinalizado(true); // Cambiamos el estado para agregar solo productos a partir de ahora

      // Limpiamos el producto
      setProducto({
        productoId: "",
        cantidad: 0,
        precio: 0,
      });

    } else {
      // Agregar productos al pedido existente
      const newDetalleOrden = {
        pedidoId: pedidoIdGuardado,
        productoId: producto.productoId,
        cantidad: producto.cantidad,
        precio: producto.precio,
      };

      // Despachamos el thunk para guardar el detalle del pedido en la base de datos
      await dispatch(addNewDetalleOrden(newDetalleOrden));
    }

    setProducto({
      productoId: "",
      cantidad: 0,
      precio: 0,
    });

    onClose();
  };

  const handleToggleDetails = (pedidoId) => {
    setIsDetailsOpen((prev) => ({
      ...prev,
      [pedidoId]: !prev[pedidoId],
    }));
  };

  const calcularTotal = (productos) => {
    return productos.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);
  };

  // Filtrar los detalles de un pedido específico
  const obtenerDetallesPedido = (pedidoId) => {
    return detalleOrden.filter((detalle) => detalle.pedidoId === pedidoId);
  };

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="blue">
        {isPedidoFinalizado ? "Agregar Productos" : "Crear Detalle de Pedido"}
      </Button>

      <Table mt={4}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidos.map((pedido) => (
            <Tr key={pedido.id}>
              <Td>{pedido.id}</Td>
              <Td>
                <Button size="sm" onClick={() => handleToggleDetails(pedido.id)}>
                  {isDetailsOpen[pedido.id] ? "Ocultar Detalles" : "Ver Detalles"}
                </Button>
                <Collapse in={isDetailsOpen[pedido.id]}>
                  <Table mt={2} size="sm">
                    <Thead>
                      <Tr>
                        <Th>Item</Th>
                        <Th>Cantidad</Th>
                        <Th>Precio</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {obtenerDetallesPedido(pedido.id).map((prod, index) => (
                        <Tr key={index}>
                          <Td>{prod.productoId}</Td>
                          <Td>{prod.cantidad}</Td>
                          <Td>{prod.precio}</Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td colSpan={2} align="right">
                          <strong>Total:</strong>
                        </Td>
                        <Td>{calcularTotal(obtenerDetallesPedido(pedido.id))}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Collapse>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isPedidoFinalizado ? "Agregar Productos" : "Agregar Detalle del Pedido"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isPedidoFinalizado && (
              <>
                <CiudadSelector value={detallePedido.ciudadId} onChange={handleCiudadChange} />
                <DeuSelector onSelect={handleDeudorSelect} />
                <TiendaSelector value={detallePedido.tiendaId} onChange={handleTiendaChange} />
              </>
            )}
            <ProductoSelector onSelect={handleProductoSelect} />
            <CantidadInput
              value={producto.cantidad}
              onChange={handleInputChange}
              error={null}
            />
            <PrecioInput
              value={producto.precio}
              onChange={handleInputChange}
              error={null}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {isPedidoFinalizado ? "Agregar" : "Guardar"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DetallePedidoForm;
