import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  Collapse,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import ProductoSelector from "./componentes/productoSelector";
import CantidadInput from "./componentes/cantidadInput";
import PrecioInput from "./componentes/precioInput";
import DeuSelector from "./componentes/DeuSelector";
import CiudadSelector from "./componentes/CiudadSelector";
import TiendaSelector from "./componentes/tiendaSelector";
import {
  addNewDetalleOrden,
  tablaDetalleOrden,
} from "../../store/Pedidos/DetallePedidos/thunks";
import { addNewPedido, tablaPedidos } from "../../store/Pedidos/thunks";

const DetallePedidoForm = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Obtener pedidos y detalleOrden desde Redux
  const pedidos = useSelector((state) => state.pedidos.pedidos); // Pedidos
  const detalleOrden = useSelector((state) => state.detalleOrden.detalleOrden); // Detalles de pedidos

  // Estado para manejar la creación de pedidos y productos
  const [currentPedido, setCurrentPedido] = useState({
    ciudadId: 0,
    deudorId: 0,
    tiendaId: 0,
    usuarioId: 0,
    estadoId: 1, // Estado inicial predeterminado
  });

  const [isPedidoFinalizado, setIsPedidoFinalizado] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState({});
  const [pedidoIdGuardado, setPedidoIdGuardado] = useState(null);
  const [producto, setProducto] = useState({
    productoId: "",
    cantidad: 0,
    precio: 0,
  });

  // Cargar pedidos y detalles al iniciar
  useEffect(() => {
    dispatch(tablaPedidos());
    dispatch(tablaDetalleOrden());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleCiudadChange = (e) => {
    const { value } = e.target;
    setCurrentPedido((prev) => ({
      ...prev,
      ciudadId: value,
    }));
  };

  const handleDeudorSelect = (deudorId) => {
    setCurrentPedido((prev) => ({
      ...prev,
      deudorId,
    }));
  };

  const handleTiendaChange = (e) => {
    const { value } = e.target;
    setCurrentPedido((prev) => ({
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
    if (!currentPedido.ciudadId && !isPedidoFinalizado)
      formErrors.ciudadId = "La ciudad es obligatoria";
    if (!currentPedido.deudorId && !isPedidoFinalizado)
      formErrors.deudorId = "El deudor es obligatorio";
    if (!currentPedido.tiendaId && !isPedidoFinalizado)
      formErrors.tiendaId = "La tienda es obligatoria";
    if (!producto.productoId)
      formErrors.productoId = "El producto es obligatorio";
    if (producto.cantidad <= 0)
      formErrors.cantidad = "La cantidad debe ser mayor a 0";
    if (producto.precio <= 0)
      formErrors.precio = "El precio debe ser mayor a 0";

    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      console.log(formErrors);
      return;
    }

    if (!isPedidoFinalizado) {
      // Crear un nuevo pedido
      const newPedido = {
        ciudadId: currentPedido.ciudadId,
        deudorId: currentPedido.deudorId,
        tiendaId: currentPedido.tiendaId,
        estadoId: 1, // Estado inicial predeterminado
      };

      try {
        const pedidoGuardado = await dispatch(addNewPedido(newPedido)).unwrap();
        setPedidoIdGuardado(pedidoGuardado.id);
        setIsPedidoFinalizado(true);

        // Volver a cargar la tabla de pedidos
        dispatch(tablaPedidos());

        // Resetear el estado del producto
        setProducto({
          productoId: "",
          cantidad: 0,
          precio: 0,
        });
      } catch (error) {
        console.error("Error al guardar el pedido:", error);
      }
    } else {
      // Guardar el detalle del pedido
      const newDetalleOrden = {
        pedidoId: pedidoIdGuardado,
        productoId: producto.productoId,
        cantidad: producto.cantidad,
        precio: producto.precio,
      };

      try {
        await dispatch(addNewDetalleOrden(newDetalleOrden)).unwrap();
        console.log("Detalle del pedido guardado");
      } catch (error) {
        console.error("Error al guardar el detalle del pedido:", error);
      }
    }

    onClose();
  };

  const handleToggleDetails = (pedidoId) => {
    setIsDetailsOpen((prev) => ({
      ...prev,
      [pedidoId]: !prev[pedidoId],
    }));
  };

  const calcularTotal = (productos) => {
    return productos.reduce(
      (total, prod) => total + prod.precio * prod.cantidad,
      0
    );
  };

  const obtenerDetallesPedido = (pedidoId) => {
    return detalleOrden.filter((detalle) => detalle.pedidoId === pedidoId);
  };

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="blue">
        {isPedidoFinalizado ? "Agregar Productos" : "Crear Pedido"}
      </Button>

      {/* Tabla para mostrar los pedidos */}
      <Table mt={4}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Ciudad</Th>
            <Th>Deudor</Th>
            <Th>Tienda</Th>
            <Th>Usuario</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidos &&
            Array.isArray(pedidos) &&
            pedidos.map((pedido) => (
              <Tr key={pedido.id}>
                <Td>{pedido.id}</Td>
                <Td>{pedido.nombreCiudad || "N/A"}</Td>
                <Td>{pedido.nombreDeu || "N/A"}</Td>
                <Td>{pedido.nombreTienda || "N/A"}</Td>
                <Td>{pedido.usuarioId || "Sin usuario"}</Td>
                <Td>{pedido.estadoId || "Desconocido"}</Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => handleToggleDetails(pedido.id)}
                  >
                    {isDetailsOpen[pedido.id] ? "▲" : "▼"}
                  </Button>
                  <Collapse in={isDetailsOpen[pedido.id]}>
                    <Table mt={2} size="sm">
                      <Thead>
                        <Tr>
                          <Th>Producto</Th>
                          <Th>Cantidad</Th>
                          <Th>Precio</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {obtenerDetallesPedido(pedido.id).map((prod, index) => (
                          <Tr key={index}>
                            <Td>{prod.producto?.nombre || prod.productoId}</Td>
                            <Td>{prod.cantidad}</Td>
                            <Td>{prod.precio}</Td>
                          </Tr>
                        ))}
                        <Tr>
                          <Td colSpan={2} align="right">
                            <strong>Total:</strong>
                          </Td>
                          <Td>
                            {calcularTotal(obtenerDetallesPedido(pedido.id))}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Collapse>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>

      {/* Modal para agregar o editar pedidos */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isPedidoFinalizado ? "Agregar Productos" : "Agregar Pedido"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isPedidoFinalizado && (
              <>
                <CiudadSelector
                  value={currentPedido.ciudadId}
                  onChange={handleCiudadChange}
                />
                <DeuSelector onSelect={handleDeudorSelect} />
                <TiendaSelector
                  value={currentPedido.tiendaId}
                  onChange={handleTiendaChange}
                />
              </>
            )}
            <ProductoSelector onSelect={handleProductoSelect} />
            <CantidadInput
              pedidoId={pedidoIdGuardado || 0}
              productoId={producto.productoId || 0}
              value={Number(producto.cantidad) || 0}
              onChange={handleInputChange}
            />
            <PrecioInput
              value={Number(producto.precio) || 0}
              onChange={handleInputChange}
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
