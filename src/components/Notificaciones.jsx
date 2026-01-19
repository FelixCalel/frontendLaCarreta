import {
  Box,
  IconButton,
  Badge,
  Collapse,
  Text,
  Tooltip,
  HStack,
  useOutsideClick,
  useColorModeValue,
  Button,
  Flex,
  Portal,
} from "@chakra-ui/react";
import { FiBell, FiCheck } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import NotificationList from "./Notificaciones/NotificationList";
import {
  getNotificaciones,
  markAsRead,
  markAllAsRead,
} from "../store/Notificaciones/thunks";
import {
  addNotificacion,
  removeNotificacion,
} from "../store/Notificaciones/notificacionesSlice";

export default function Notifications({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const ref = useRef();
  const dispatch = useDispatch();

  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = localStorage.getItem("roleId");

  const { notificaciones = [], unreadCount } = useSelector(
    (state) => state.notificaciones || {}
  );
  const { token, user, rutas: userRutasIds } = useSelector((state) => state.auth || {});
  const rolNombre = user?.role?.nombre || localStorage.getItem("rolNombre");

  const colors = {
    containerBg: useColorModeValue("white", "gray.800"),
    containerBorder: useColorModeValue("gray.200", "gray.700"),
    headerBg: useColorModeValue("gray.50", "gray.700"),
    textColor: useColorModeValue("gray.700", "gray.200"),
    mutedColor: useColorModeValue("gray.500", "gray.400"),
    badgeBorder: useColorModeValue("white", "gray.800"),
  };

  useEffect(() => {
    if (usuarioId) {
      dispatch(getNotificaciones(usuarioId));
    }

    const handleNotification = (event) => {
      const newNotification = event.detail;

      const notifUserId = newNotification.usuarioId
        ? parseInt(newNotification.usuarioId, 10)
        : null;
      if (!notifUserId || notifUserId !== usuarioId) {
        // If it's not a direct targeted notification, check if it's a route-based one
        const tiendaId = newNotification.tiendaId || (newNotification.data && newNotification.data.tiendaId);
        const rutaId = newNotification.rutaId || (newNotification.data && newNotification.data.rutaId);

        // If we are "Ventas" or "Display", we must check route permissions
        if (rolNombre === "Ventas" || rolNombre === "Display") {
           // If we have route info, we check if it belongs to our assigned routes
           if (rutaId && userRutasIds && userRutasIds.length > 0) {
             if (!userRutasIds.includes(parseInt(rutaId, 10))) {
               return;
             }
           } else if (!notifUserId) {
             // If no route info and not targeted to us, we skip global ones we shouldn't see
             // (unless they are truly global, but here we expect route-based)
             return;
           }
        } else if (!notifUserId) {
           // Not targeted and not a role that handles routes? 
           // If it's not targeted to us, we probably shouldn't see it
           return;
        }
      }

      if (rolNombre === "Ventas") {
        const estadoId =
          newNotification.estadoId ||
          (newNotification.data && newNotification.data.estadoId);
        if (estadoId && parseInt(estadoId) !== 2) {
          return;
        }
      }

      if (rolNombre === "Display") {
        const estadoId =
          newNotification.estadoId ||
          (newNotification.data && newNotification.data.estadoId);
        // Display only sees Approved (3), Cancelled (4), or Exported (5)
        if (estadoId && ![3, 4, 5].includes(parseInt(estadoId))) {
          return;
        }
      }

      if (!newNotification.id) {
        console.warn("Received notification without ID:", newNotification);
        return;
      }

      dispatch(addNotificacion(newNotification));
    };

    const handleNotificationDeleted = (event) => {
      const { id, pedidoId, usuarioId: targetUserId } = event.detail;

      const parsedTargetId = targetUserId ? parseInt(targetUserId, 10) : null;

      if (parsedTargetId && parsedTargetId !== usuarioId) {
        return;
      }

      dispatch(removeNotificacion({ id, pedidoId }));
    };

    window.addEventListener("notification-received", handleNotification);
    window.addEventListener("notification-deleted", handleNotificationDeleted);

    return () => {
      window.removeEventListener("notification-received", handleNotification);
      window.removeEventListener(
        "notification-deleted",
        handleNotificationDeleted
      );
    };
  }, [dispatch, usuarioId, roleId]);

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) onClose();
    },
  });

  const handleNotificationClick = async (notificacion) => {
    if (!notificacion.id) return;

    const pedidoId =
      notificacion.pedidoId ||
      (notificacion.data && notificacion.data.pedidoId);

    if (pedidoId) {
      const navigationState = { state: { highlightedPedidoId: pedidoId } };
      console.log("Navigating to historial with state:", navigationState);
      if (rolNombre === "Ventas") {
        navigate(`/pedidos/entrantes`, navigationState);
      } else if (rolNombre === "Display") {
        navigate(`/historialPedido/listar`, navigationState);
      } else {
        navigate(`/historialPedido/listar`, navigationState);
      }
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const filteredNotificaciones = notificaciones.filter((n) => {
    const nUsuarioId = n.usuarioId || (n.data && n.data.usuarioId);

    if (!nUsuarioId || parseInt(nUsuarioId) !== usuarioId) {
      return false;
    }

    if (rolNombre === "Ventas") {
      const estadoId = n.estadoId || (n.data && n.data.estadoId);
      if (estadoId !== undefined && estadoId !== null) {
        return parseInt(estadoId) === 2;
      }
      return true;
    }

    if (rolNombre === "Display") {
      const estadoId = n.estadoId || (n.data && n.data.estadoId);
      if (estadoId !== undefined && estadoId !== null) {
        return [3, 4, 5].includes(parseInt(estadoId));
      }
      return true;
    }

    if (nUsuarioId && parseInt(nUsuarioId) === usuarioId) {
      return true;
    }

    // Additional route-level check for Sales/Display if not already matched by ID
    if (rolNombre === "Ventas" || rolNombre === "Display") {
      const nRutaId = n.rutaId || (n.data && n.data.rutaId);
      if (nRutaId && userRutasIds && userRutasIds.length > 0) {
        return userRutasIds.includes(parseInt(nRutaId, 10));
      }
    }

    return false;
  });

  const displayUnreadCount = filteredNotificaciones.filter(
    (n) => !n.leido
  ).length;

  return (
    <Box position="relative">
      <Tooltip
        label="Notificaciones"
        aria-label="Notificaciones Tooltip"
        zIndex={9999}
      >
        <Box position="relative" onClick={onToggle} cursor="pointer">
          <IconButton
            variant="ghost"
            fontSize="24px"
            icon={<FiBell />}
            aria-label="Notificaciones"
            size="lg"
            _hover={{ color: "blue.500", bg: "transparent" }}
            _active={{ bg: "transparent" }}
          />
          {displayUnreadCount > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="8px"
              right="8px"
              fontSize="0.6em"
              px={1.5}
              border="2px solid"
              borderColor={colors.badgeBorder}
            >
              {displayUnreadCount}
            </Badge>
          )}
        </Box>
      </Tooltip>

      <Portal>
        <Collapse in={isOpen} animateOpacity>
          <Box
            ref={ref}
            pos="fixed"
            top={{ base: "70px", md: "60px" }}
            right={{ base: "50%", md: "16px" }}
            transform={{ base: "translateX(50%)", md: "none" }}
            w={{ base: "90vw", md: "380px" }}
            maxW={{ base: "400px", md: "380px" }}
            bg={colors.containerBg}
            color={colors.textColor}
            boxShadow="2xl"
            borderRadius="xl"
            zIndex="9999"
            border="1px solid"
            borderColor={colors.containerBorder}
            overflow="hidden"
          >
            <Flex
              p={4}
              bg={colors.headerBg}
              justify="space-between"
              align="center"
              borderBottom="1px solid"
              borderColor={colors.containerBorder}
            >
              <HStack spacing={2}>
                <Text fontWeight="bold" fontSize="md">
                  Notificaciones {rolNombre === "Ventas" ? "de Pedidos" : rolNombre === "Display" ? "de Display" : ""}
                </Text>
                {displayUnreadCount > 0 && (
                  <Badge colorScheme="blue" borderRadius="full" px={2}>
                    {displayUnreadCount} nuevas
                  </Badge>
                )}
              </HStack>
              {displayUnreadCount > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={handleMarkAllAsRead}
                  leftIcon={<FiCheck />}
                  _hover={{ bg: "blue.50" }}
                >
                  Marcar todo leído
                </Button>
              )}
            </Flex>

            <NotificationList
              notificaciones={filteredNotificaciones}
              onMarkAsRead={handleMarkAsRead}
              onNotificationClick={handleNotificationClick}
            />

            <Box
              p={2}
              bg={colors.headerBg}
              borderTop="1px solid"
              borderColor={colors.containerBorder}
              textAlign="center"
            >
              <Text fontSize="xs" color={colors.mutedColor}>
                Mantente al día con tus pedidos
              </Text>
            </Box>
          </Box>
        </Collapse>
      </Portal>
    </Box>
  );
}

Notifications.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
