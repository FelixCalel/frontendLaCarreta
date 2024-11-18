import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaPedidos } from "../../../store/Pedidos/thunks";
import { getDetalleOrdenByPedidoId } from "../../../store/Pedidos/DetallePedidos/thunks";

const HistorialPedidosPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isLoadingDetalles, setIsLoadingDetalles] = useState(false);

  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = parseInt(localStorage.getItem("roleId"), 10);

  // Obtener todos los pedidos del store
  const pedidos = useSelector((state) => state.pedidos.data);

  // Filtrar pedidos según rol y usuario
  const pedidosHistorial = pedidos.filter((pedido) => {
    const esAprobadoOCancelado = pedido.estadoId === 3 || pedido.estadoId === 4;

    // Si el usuario es un administrador (roleId === 1) o un rol 3, ve todos los pedidos.
    // Si no, ve solo los pedidos asociados a su usuarioId.
    if (roleId === 1 || roleId === 3) {
      return esAprobadoOCancelado;
    } else {
      return esAprobadoOCancelado && pedido.usuarioId === usuarioId;
    }
  });

  // Cargar pedidos al montar el componente
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  const handleVerDetalles = async (pedido) => {
    setIsLoadingDetalles(true);
    setSelectedPedido(pedido);
    try {
      const detalles = await dispatch(getDetalleOrdenByPedidoId(pedido.id)).unwrap();
      setDetallesPedido(detalles);
    } catch (error) {
      console.error(`Error al obtener los detalles del pedido ${pedido.id}:`, error);
    } finally {
      setIsLoadingDetalles(false);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setDetallesPedido([]);
  };

  return (
    <Box p={6} boxShadow="xl" bg="white" rounded="lg">
      <Heading as="h2" size="lg" mb={6}>
        Historial de Pedidos
      </Heading>

      {pedidosHistorial.length > 0 ? (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Estado</Th>
              <Th>Deudor</Th>
              <Th>Tienda</Th>
              <Th>Fecha</Th>
              {roleId === 1 || roleId === 3 ? <Th>Usuario</Th> : null}
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pedidosHistorial.map((pedido) => (
              <Tr key={pedido.id}>
                <Td>{pedido.id}</Td>
                <Td>
                  {pedido.estadoId === 3 ? (
                    <Box color="green.600" fontWeight="bold">
                      Aprobado
                    </Box>
                  ) : (
                    <Box color="red.600" fontWeight="bold">
                      Cancelado
                    </Box>
                  )}
                </Td>
                <Td>
                  {pedido.nombreCorrelativo} - {pedido.nombreDeu || "N/A"}
                </Td>
                <Td>{pedido.nombreTienda || "N/A"}</Td>
                <Td>{pedido.fechaOrden}</Td>
                {roleId === 1 || roleId === 3 ? (
                  <Td>{pedido.nombreUsuario || "Desconocido"}</Td>
                ) : null}
                <Td>
                  <Tooltip label="Ver Detalles" hasArrow>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleVerDetalles(pedido)}
                    >
                      Ver Detalles
                    </Button>
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Box textAlign="center" color="gray.500" mt={6}>
          No hay pedidos aprobados o cancelados para mostrar.
        </Box>
      )}

      {/* Modal para mostrar los detalles del pedido */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Detalles del Pedido {selectedPedido?.id}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoadingDetalles ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Spinner size="lg" />
              </Box>
            ) : detallesPedido.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Código</Th>
                    <Th>Producto</Th>
                    <Th>Cantidad</Th>
                    <Th>Precio</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {detallesPedido.map((detalle) => (
                    <Tr key={detalle.id}>
                      <Td>{detalle.codigo || "N/A"}</Td>
                      <Td>{detalle.nombreProducto}</Td>
                      <Td>{detalle.cantidad}</Td>
                      <Td>{detalle.precio}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box textAlign="center" color="gray.500">
                No hay detalles disponibles para este pedido.
              </Box>
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

export default HistorialPedidosPage;
