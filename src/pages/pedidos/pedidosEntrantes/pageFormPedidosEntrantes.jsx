import { useEffect, useState } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, Box, Button, Checkbox, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos, togglePedidoStatus } from "../../../store/Pedidos/thunks"; 
import { fetchUsuarios } from "../../../store/Usuarios/usuariosSlice"; 
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks"; 

const EntrantesPage = () => {
  const dispatch = useDispatch();

  // Obtener pedidos y usuarios desde Redux
  const pedidos = useSelector((state) => state.pedidos.data);
  const usuarios = useSelector((state) => state.usuarios.data); 

  // Estado para almacenar los montos totales por pedido
  const [montos, setMontos] = useState({});
  
  // Estado de carga para las operaciones de aprobar/cancelar
  const [isLoading, setIsLoading] = useState(false);

  // Estado para gestionar las selecciones de pedidos
  const [selectedPedidos, setSelectedPedidos] = useState([]);

  // Estado para almacenar detalles del pedido seleccionado
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar solo los pedidos con estadoId 2
  const pedidosEntrantes = pedidos.filter((pedido) => pedido.estadoId === 2);

  // Cargar los pedidos y usuarios al montar el componente
  useEffect(() => {
    dispatch(tablaPedidos());
    dispatch(fetchUsuarios());
  }, [dispatch]);

  // Cargar los detalles del pedido para calcular el total
  useEffect(() => {
    const cargarMontos = async () => {
      const montosTemp = {};
      for (const pedido of pedidosEntrantes) {
        try {
          const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
          const totalMonto = detalles.reduce((acc, detalle) => {
            const precio = parseFloat(detalle.precio); 
            const cantidad = parseFloat(detalle.cantidad); 
            if (!isNaN(precio) && !isNaN(cantidad)) {
              return acc + (precio * cantidad); 
            }
            return acc;
          }, 0);
          montosTemp[pedido.id] = totalMonto; 
        } catch (error) {
          console.error(`Error al cargar detalles para pedido ${pedido.id}:`, error);
          montosTemp[pedido.id] = 0; 
        }
      }
      setMontos(montosTemp); 
    };
    cargarMontos();
  }, [dispatch, pedidosEntrantes]);

  const getNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(user => user.id === usuarioId);
    return usuario ? usuario.nombre : "N/A"; 
  };

  const handleSelectPedido = (pedidoId) => {
    if (selectedPedidos.includes(pedidoId)) {
      setSelectedPedidos(selectedPedidos.filter(id => id !== pedidoId));
    } else {
      setSelectedPedidos([...selectedPedidos, pedidoId]);
    }
  };

  console.log('Selected Pedidos:', selectedPedidos);

  

  // Manejar la apertura del modal de detalles
  const handleVerDetalles = async (pedidoId) => {
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedidoId)).unwrap();
      setDetallesPedido(detalles);
      setSelectedPedido(pedidoId);
      setIsModalOpen(true); // Abrir modal
    } catch (error) {
      console.error(`Error al obtener los detalles del pedido ${pedidoId}:`, error);
    }
  };

  // Cerrar modal de detalles
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  // Optimistic Update: Refleja los cambios en la UI inmediatamente
  const updatePedidosOptimistically = (newEstadoId) => {
    const updatedPedidos = pedidos.map((pedido) => {
      if (selectedPedidos.includes(pedido.id)) {
        return { ...pedido, estadoId: newEstadoId };
      }
      return pedido;
    });
    return updatedPedidos;
  };

  // Aprobar pedidos seleccionados
// Aprobar pedidos seleccionados
const handleAprobarPedidos = async () => {
    setIsLoading(true);
  
    try {
      // Iterar sobre los pedidos seleccionados y aprobarlos
      for (const pedidoId of selectedPedidos) {
        await dispatch(togglePedidoStatus({ id: pedidoId, estadoId: 3 }));
      }
      setSelectedPedidos([]); // Limpia la selección después de aprobar
    } catch (error) {
      console.error("Error al aprobar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Cancelar pedidos seleccionados
  const handleCancelarPedidos = async () => {
    setIsLoading(true);
  
    try {
      // Iterar sobre los pedidos seleccionados y cancelarlos
      for (const pedidoId of selectedPedidos) {
        await dispatch(togglePedidoStatus({ id: pedidoId, estadoId: 4 }));
      }
      setSelectedPedidos([]); // Limpia la selección después de cancelar
    } catch (error) {
      console.error("Error al cancelar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <Box p={4}>
      <Box mb={4}>
        <Button 
          colorScheme="green" 
          mr={2} 
          onClick={handleAprobarPedidos} 
          isDisabled={selectedPedidos.length === 0 || isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : 'Aprobar Pedidos'}
        </Button>
        <Button 
          colorScheme="red" 
          onClick={handleCancelarPedidos} 
          isDisabled={selectedPedidos.length === 0 || isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : 'Cancelar Pedidos'}
        </Button>
      </Box>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Select</Th>
            <Th>ID</Th>
            <Th>Usuario</Th>
            <Th>Tienda</Th>
            <Th>Deudor</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pedidosEntrantes.length > 0 ? (
            pedidosEntrantes.map((pedido) => (
              <Tr key={pedido.id}>
                <Td>
                  <Checkbox
                    isChecked={selectedPedidos.includes(pedido.id)}
                    onChange={() => handleSelectPedido(pedido.id)}
                  />
                </Td>
                <Td>{pedido.id}</Td>
                <Td>{pedido.nombreUsuario}</Td>
                <Td>{pedido.nombreTienda}</Td>
                <Td>{pedido.nombreDeu}</Td>
                <Td>{pedido.fechaOrden}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm" onClick={() => handleVerDetalles(pedido.id)}>
                    Ver Detalles
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="8" align="center">No hay pedidos en estado 2</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Modal de detalles del pedido */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles del Pedido {selectedPedido}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detallesPedido.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Producto</Th>
                    <Th>Cantidad</Th>
                    <Th>Precio</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {detallesPedido.map((detalle) => (
                    <Tr key={detalle.id}>
                      <Td>{detalle.nombreProducto}</Td>
                      <Td>{detalle.cantidad}</Td>
                      <Td>{detalle.precio}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box>No hay detalles disponibles</Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EntrantesPage;
