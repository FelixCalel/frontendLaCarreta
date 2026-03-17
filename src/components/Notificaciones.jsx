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
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import NotificationList from "./Notificaciones/NotificationList";
import { useNotificationSystem } from "./Notificaciones/hooks/useNotificationSystem";

export default function Notifications({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const ref = useRef();
  const {
    filteredNotificaciones,
    displayUnreadCount,
    rolNombre,
    handleMarkAllAsRead,
    handleMarkAsRead,
    roleId,
  } = useNotificationSystem();

  const colors = {
    containerBg: useColorModeValue("white", "gray.800"),
    containerBorder: useColorModeValue("gray.200", "gray.700"),
    headerBg: useColorModeValue("gray.50", "gray.700"),
    textColor: useColorModeValue("gray.700", "gray.200"),
    mutedColor: useColorModeValue("gray.500", "gray.400"),
    badgeBorder: useColorModeValue("white", "gray.800"),
  };

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) onClose();
    },
  });

  const handleBellClick = () => {
    if (isOpen) {
      onClose();
      return;
    }
    onToggle();
  };

  const handleNotificationClick = async (notificacion) => {
    if (!notificacion.id) return;

    const pedidoId =
      notificacion.pedidoId ||
      (notificacion.data && notificacion.data.pedidoId);

    if (pedidoId) {
      const navigationState = { state: { highlightedPedidoId: pedidoId } };
      console.log("Navigating with state:", navigationState);

      const userRoleId = parseInt(roleId, 10);

      if (userRoleId === 3) {
        navigate(`/pedidos/entrantes`, navigationState);
      } else {
        navigate(`/historialPedido/listar`, navigationState);
      }
    }
  };

  return (
    <Box position="relative">
      <Tooltip
        label="Notificaciones"
        aria-label="Notificaciones Tooltip"
        zIndex={9999}
      >
        <Box position="relative" onClick={handleBellClick} cursor="pointer">
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
              py={2}
              px={3}
              bg={colors.headerBg}
              justify="space-between"
              align="center"
              borderBottom="1px solid"
              borderColor={colors.containerBorder}
            >
              <HStack spacing={1.5}>
                <Text fontWeight="bold" fontSize="sm">
                  Notificaciones
                </Text>
                {displayUnreadCount > 0 && (
                  <Badge
                    colorScheme="blue"
                    borderRadius="full"
                    px={1.5}
                    fontSize="0.65em"
                  >
                    {displayUnreadCount} NUEVAS
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
                  fontSize="0.65rem"
                  _hover={{ bg: "blue.50" }}
                >
                  Marcar todo leído
                </Button>
              )}
            </Flex>

            <NotificationList
              notificaciones={filteredNotificaciones}
              rolNombre={rolNombre}
              onMarkAsRead={handleMarkAsRead}
              onNotificationClick={handleNotificationClick}
            />

            <Box
              py={1}
              px={3}
              bg={colors.headerBg}
              borderTop="1px solid"
              borderColor={colors.containerBorder}
              textAlign="center"
            >
              <Text fontSize="0.65rem" color={colors.mutedColor}>
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
