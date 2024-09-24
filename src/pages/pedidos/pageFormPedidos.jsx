import { useEffect, useState } from "react";
import React from "react";
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
import DeuSelector from "./componentes/DeuSelector";
import CiudadSelector from "./componentes/CiudadSelector";
import TiendaSelector from "./componentes/tiendaSelector";
import ProductosTable from "./componentes/detallesPedidosTable";
import {
  tablaDetalleOrden,
} from "../../store/Pedidos/DetallePedidos/thunks";
import { addNewPedido, tablaPedidos } from "../../store/Pedidos/thunks";

const DetallePedidoForm = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Obtener pedidos y detalleOrden desde Redux
  const pedidos = useSelector((state) => state.pedidos.data); // Asegúrate de acceder a state.pedidos.data
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

  // Cargar pedidos y detalles al iniciar
  useEffect(() => {
    dispatch(tablaPedidos()).then((response) => {
      console.log("Pedidos cargados en Redux:", response.payload); // Verifica que el payload contiene los datos esperados
    });
    dispatch(tablaDetalleOrden()).then((response) => {
      console.log("Detalle de orden cargado en Redux:", response.payload);
    });
  }, [dispatch]);

  // Manejo del cambio de ciudad
  const handleCiudadChange = (e) => {
    const { value } = e.target;
    setCurrentPedido((prev) => ({
      ...prev,
      ciudadId: parseInt(value, 10), // Convertir a número
    }));
  };

  // Manejo del cambio de deudor
  const handleDeudorSelect = (deudorId) => {
    setCurrentPedido((prev) => ({
      ...prev,
      deudorId,
    }));
  };

  // Manejo del cambio de tienda
  const handleTiendaChange = (value) => {
    setCurrentPedido((prev) => ({
      ...prev,
      tiendaId: value,
    }));
  };

  // Validar los campos del formulario
  const validateFields = () => {
    let formErrors = {};
    if (!currentPedido.ciudadId && !isPedidoFinalizado)
      formErrors.ciudadId = "La ciudad es obligatoria";
    if (!currentPedido.deudorId && !isPedidoFinalizado)
      formErrors.deudorId = "El deudor es obligatorio";
    if (!currentPedido.tiendaId && !isPedidoFinalizado)
      formErrors.tiendaId = "La tienda es obligatoria";

    return formErrors;
  };

  // Manejo del envío del formulario
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
      } catch (error) {
        console.error("Error al guardar el pedido:", error);
      }
    }

    onClose();
  };

  // Manejo del colapso de detalles del pedido
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
    // Asegurarnos de que detalleOrden sea un array
    if (!Array.isArray(detalleOrden)) {
      return [];
    }
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
            <Th>Estado</Th>
            <Th>Detalles</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidos && pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <React.Fragment key={pedido.id}>
                <Tr>
                  <Td>{pedido.id}</Td>
                  <Td>{pedido.nombreCiudad || "N/A"}</Td>
                  <Td>{pedido.nombreDeu || "N/A"}</Td>
                  <Td>{pedido.nombreTienda || "N/A"}</Td>
                  <Td>{pedido.estadoId || "N/A"}</Td>
                  <Td>
                    <Button
                      size="sm"
                      onClick={() => handleToggleDetails(pedido.id)}
                    >
                      {isDetailsOpen[pedido.id] ? "▲" : "▼"}
                    </Button>
                  </Td>
                </Tr>
                {/* Aquí se desplegará ProductosTable para cada pedido */}
                <Tr>
                  <Td colSpan={6}>
                    <Collapse in={isDetailsOpen[pedido.id]}>
                      <ProductosTable pedidoId={pedido.id} />
                    </Collapse>
                  </Td>
                </Tr>
              </React.Fragment>
            ))
          ) : (
            <Tr>
              <Td colSpan="6" align="center">
                No hay pedidos disponibles
              </Td>
            </Tr>
          )}
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
            {isPedidoFinalizado && (
              <ProductosTable pedidoId={pedidoIdGuardado} />
            )}
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
