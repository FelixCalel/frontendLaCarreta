import {
  Box,
  IconButton,
  Badge,
  Collapse,
  Text,
  Tooltip,
  CloseButton,
  HStack,
  useOutsideClick,
  useColorModeValue,  // <-- Importar para modo claro/oscuro
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

  // Pedidos desde Redux
  const pedidos = useSelector((state) => state.pedidos.data || []);

  // Estados locales
  const [notificaciones, setNotificaciones] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState(() => {
    const storedDeleted = localStorage.getItem(`deletedNotifications_${usuarioId}`);
    return storedDeleted ? JSON.parse(storedDeleted) : [];
  });

  // Sincronizar `deletedNotifications` con `localStorage` al cambiar usuario
  useEffect(() => {
    const storedDeleted = localStorage.getItem(`deletedNotifications_${usuarioId}`);
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
  useEffect(() => {
    const usuarioPedidos = pedidos
      .filter(
        (pedido) =>
          (pedido.usuarioId === usuarioId || roleId === "3") && // notificaciones propias o pendientes para rol 3
          !deletedNotifications.includes(pedido.id)
      )
      .filter(
        (pedido) =>
          roleId === "3"
            ? // rol 3 => estado 2 (pendientes) o 5 (exportados) por ejemplo
              pedido.estadoId === 2 || pedido.estadoId === 5
            : // rol 2 => estado 3 (aprobados) o 4 (cancelados)
              pedido.estadoId === 3 || pedido.estadoId === 4
      )
      .sort((a, b) => new Date(b.creadoEl) - new Date(a.creadoEl));

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
    localStorage.setItem(
      `deletedNotifications_${usuarioId}`,
      JSON.stringify(updatedNotifications)
    );
  };

  const containerBg  = useColorModeValue("white", "gray.700");
  const containerTxt = useColorModeValue("gray.700", "gray.200");
  const borderColor  = useColorModeValue("gray.200", "gray.600");
  const hoverBg      = useColorModeValue("gray.50",  "gray.600");

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
          bg={containerBg}           // <-- Modo claro/oscuro
          color={containerTxt}       // <-- Texto adaptado a modo
          boxShadow="lg"
          p={4}
          borderRadius="lg"
          zIndex="1000"
          border="1px solid"
          borderColor={borderColor}  // <-- Borde adaptado
        >
          {notificaciones.length > 0 ? (
            notificaciones.map((pedido) => (
              <HStack
                key={pedido.id}
                justify="space-between"
                align="center"
                p={2}
                borderRadius="md"
                _hover={{ bg: hoverBg }}  // <-- hover adaptado
              >
                <Box
                  onClick={handleNotificationClick}
                  cursor="pointer"
                  flex={1}
                >
                  {roleId === "3" ? (
                    <Text fontSize="sm" fontWeight="medium">
                      Nuevo pedido pendiente: <strong>ID: {pedido.id}</strong>.
                    </Text>
                  ) : (
                    <Text fontSize="sm" fontWeight="medium">
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
        </Box>
      </Collapse>
    </Box>
  );
}

Notifications.propTypes = {
  isOpen:   PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClose:  PropTypes.func.isRequired,
};
