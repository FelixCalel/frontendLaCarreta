import {
  Box,
  IconButton,
  Badge,
  Collapse,
  Text,
  Divider,
  Tooltip,
  CloseButton,
  HStack,
  useOutsideClick,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { tablaPedidos } from "../store/Pedidos/thunks";

export default function Notifications({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();

  // Usuario actual
  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = localStorage.getItem("roleId");

  // Pedidos obtenidos desde Redux
  const pedidos = useSelector((state) => state.pedidos.data || []);

  // Estados locales
  const [notificaciones, setNotificaciones] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState(() => {
    const storedDeleted = localStorage.getItem(
      `deletedNotifications_${usuarioId}`
    );
    return storedDeleted ? JSON.parse(storedDeleted) : [];
  });

  // Sincronizar `deletedNotifications` con `localStorage` al actualizar usuario
  useEffect(() => {
    const storedDeleted = localStorage.getItem(
      `deletedNotifications_${usuarioId}`
    );
    setDeletedNotifications(storedDeleted ? JSON.parse(storedDeleted) : []);
  }, [usuarioId]);

  // Guardar en `localStorage` cada vez que cambien las notificaciones eliminadas
  useEffect(() => {
    localStorage.setItem(
      `deletedNotifications_${usuarioId}`,
      JSON.stringify(deletedNotifications)
    );
  }, [deletedNotifications, usuarioId]);

  // Filtrar notificaciones según rol y estado, excluyendo eliminadas
  // Filtrar notificaciones según rol y estado, excluyendo eliminadas
  useEffect(() => {
    const usuarioPedidos = pedidos
      .filter(
        (pedido) =>
          (pedido.usuarioId === usuarioId || roleId === "3") && // Notificaciones propias o pendientes para rol 3
          !deletedNotifications.includes(pedido.id) // Excluir eliminadas
      )
      .filter(
        (pedido) =>
          roleId === "3"
            ? pedido.estadoId === 2 || pedido.estadoId === 5 // Pendientes o Exportados para rol 3
            : pedido.estadoId === 3 || pedido.estadoId === 4 // Aprobados o Cancelados para rol 2
      )
      .sort((a, b) => new Date(b.creadoEl) - new Date(a.creadoEl)); // Orden descendente

    setNotificaciones(usuarioPedidos);
  }, [pedidos, roleId, usuarioId, deletedNotifications]);

  // Cargar pedidos al inicializar
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  // Manejar clic fuera del contenedor para cerrar notificaciones
  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) onClose();
    },
  });

  // Manejo de redirecciones
  const handleNotificationClick = () => {
    if (roleId === "3") {
      navigate(`/pedidos/entrantes`);
    } else if (roleId === "2") {
      navigate(`/historialPedido/listar`);
    }
  };

  // Manejo de eliminación de notificaciones
  const handleDeleteNotification = (pedidoId) => {
    const updatedNotifications = [...deletedNotifications, pedidoId];
    setDeletedNotifications(updatedNotifications);
    // Actualizar localStorage inmediatamente al borrar
    localStorage.setItem(
      `deletedNotifications_${usuarioId}`,
      JSON.stringify(updatedNotifications)
    );
  };

  // Conteo de estados para el resumen (solo para rol 3)
  // const countAprobados = pedidos.filter(
  //   (pedido) => pedido.estadoId === 3 && pedido.usuarioId === usuarioId
  // ).length;
  // const countEnProceso = pedidos.filter(
  //   (pedido) => pedido.estadoId === 1 && pedido.usuarioId === usuarioId
  // ).length;
  // const countCancelados = pedidos.filter(
  //   (pedido) => pedido.estadoId === 4 && pedido.usuarioId === usuarioId
  // ).length;
  // const countExportados = pedidos.filter(
  //   (pedido) => pedido.estadoId === 5 && pedido.usuarioId === usuarioId
  // ).length;

  return (
    <Box position="relative">
      {/* Icono de notificaciones */}
      <Tooltip label="Notificaciones" aria-label="Notificaciones Tooltip">
        <Box position="relative" onClick={onToggle}>
          <IconButton
            variant="ghost"
            fontSize={{ base: "20px", md: "24px" }}
            icon={<FiBell />}
            size="lg"
            _hover={{ color: "blue.600", transform: "scale(1.05)" }}
            transition="all 0.2s ease-in-out"
          />
          {notificaciones.length > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="-1px"
              right="-1px"
              fontSize="xs"
              p="4px"
            >
              {notificaciones.length}
            </Badge>
          )}
        </Box>
      </Tooltip>

      {/* Notificaciones desplegables */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          ref={ref}
          pos="absolute"
          top="60px"
          right="0"
          w="320px"
          bg="white"
          boxShadow="lg"
          p={4}
          borderRadius="lg"
          zIndex="1000"
          border="1px solid #E2E8F0"
        >
          {notificaciones.length > 0 ? (
            notificaciones.map((pedido) => (
              <HStack
                key={pedido.id}
                justify="space-between"
                align="center"
                p={2}
                borderRadius="md"
                _hover={{ bg: "gray.50" }}
              >
                <Box
                  onClick={handleNotificationClick}
                  cursor="pointer"
                  flex={1}
                >
                  {roleId === "3" ? (
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Nuevo pedido pendiente: <strong>ID: {pedido.id}</strong>.
                    </Text>
                  ) : (
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Tu pedido <strong>ID: {pedido.id}</strong> ha sido{" "}
                      <strong>
                        {pedido.estadoId === 3 ? "aprobado" : "cancelado"}
                      </strong>
                      .
                    </Text>
                  )}
                </Box>
                <CloseButton
                  size="sm"
                  onClick={() => handleDeleteNotification(pedido.id)}
                />
              </HStack>
            ))
          ) : (
            <Text textAlign="center" fontSize="sm" color="gray.500">
              No tienes notificaciones nuevas.
            </Text>
          )}

          {roleId === "3" && (
            <>
              <Divider my={3} />
              {/* <Box>
                <Text fontSize="md" fontWeight="bold">
                  Estado de tus pedidos:
                </Text>
                <Box mt={2}>
                  <Text fontSize="sm" color="green.600">
                    Aprobados: {countAprobados}
                  </Text>
                  <Text fontSize="sm" color="yellow.600">
                    En Proceso: {countEnProceso}
                  </Text>
                  <Text fontSize="sm" color="red.600">
                    Cancelados: {countCancelados}
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    Exportados: {countExportados}
                  </Text>
                </Box>
              </Box> */}
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

// Agregar validación de PropTypes
Notifications.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
