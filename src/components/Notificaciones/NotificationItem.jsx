import PropTypes from "prop-types";
import {
  Box,
  HStack,
  Text,
  Badge,
  Icon,
  Tooltip,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiCheck,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const typeStyles = {
  warning: {
    iconColor: "yellow.500",
    icon: FiClock,
    label: "PENDIENTE",
    badgeScheme: "yellow",
    bgLight: "yellow.50",
    bgDark: "yellow.900",
    border: "yellow.400",
  },
  success: {
    iconColor: "green.500",
    icon: FiCheckCircle,
    label: "APROBADO",
    badgeScheme: "green",
    bgLight: "green.50",
    bgDark: "green.900",
    border: "green.400",
  },
  error: {
    iconColor: "red.500",
    icon: FiAlertCircle,
    label: "CANCELADO",
    badgeScheme: "red",
    bgLight: "red.50",
    bgDark: "red.900",
    border: "red.400",
  },
  info: {
    iconColor: "blue.500",
    icon: FiInfo,
    label: "EXPORTADO",
    badgeScheme: "blue",
    bgLight: "blue.50",
    bgDark: "blue.900",
    border: "blue.400",
  },
};

const getStyleByEstado = (estadoId) => {
  const parsed = parseInt(estadoId, 10);
  if (parsed === 2) return typeStyles.warning;
  if (parsed === 3) return typeStyles.success;
  if (parsed === 4) return typeStyles.error;
  if (parsed === 5 || parsed === 6) return typeStyles.info;
  return null;
};

const NotificationItem = ({
  notificacion,
  rolNombre,
  onMarkAsRead,
  onClick,
}) => {
  const notificationKind =
    notificacion.notificationKind ||
    (notificacion.data && notificacion.data.notificationKind);
  const estadoId =
    notificacion.estadoId || (notificacion.data && notificacion.data.estadoId);
  const isVentasNewOrder =
    rolNombre === "Ventas" &&
    (notificationKind === "NEW_ORDER" || parseInt(estadoId, 10) === 2);
  const styles = isVentasNewOrder
    ? {
        ...typeStyles.info,
        icon: FiAlertCircle,
        label: "NUEVO",
      }
    : notificationKind === "NEW_ORDER"
      ? { ...typeStyles.info, label: "NUEVO" }
      : getStyleByEstado(estadoId) ||
        typeStyles[(notificacion.tipo || "").toLowerCase()] ||
        typeStyles.info;

  const displayTitle = isVentasNewOrder
    ? `Nuevo pedido #${notificacion.pedidoId || (notificacion.data && notificacion.data.pedidoId) || ""}`.trim()
    : notificacion.titulo || "Notificación";

  const displayMessage = isVentasNewOrder
    ? "Ha ingresado un nuevo pedido que requiere atención."
    : notificacion.mensaje || "Tienes una nueva notificación";

  const bg = useColorModeValue(styles.bgLight, styles.bgDark);
  const hoverBg = useColorModeValue("blue.50", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      py={1.5}
      px={3}
      bg={notificacion.leido ? "transparent" : bg}
      borderLeft="3px solid"
      borderColor={notificacion.leido ? "transparent" : styles.border}
      _hover={{ bg: hoverBg, cursor: "pointer" }}
      onClick={() => onClick(notificacion)}
      transition="all 0.2s"
      position="relative"
    >
      <HStack align="center" spacing={2}>
        <Icon
          as={styles.icon}
          color={styles.iconColor}
          boxSize={4}
          flexShrink={0}
        />
        <Box flex={1} minW={0}>
          <HStack justify="space-between" spacing={1}>
            <Text
              fontSize="xs"
              fontWeight={notificacion.leido ? "normal" : "semibold"}
              isTruncated
            >
              {displayTitle}
            </Text>
            <Badge
              colorScheme={styles.badgeScheme}
              fontSize="0.55em"
              flexShrink={0}
            >
              {styles.label}
            </Badge>
          </HStack>
          <Text fontSize="xs" color={mutedColor} noOfLines={1}>
            {displayMessage}
          </Text>
          <HStack spacing={1} color={mutedColor} mt={0.5}>
            <Icon as={FiClock} boxSize={2.5} />
            <Text fontSize="0.65rem">
              {notificacion.creadoEl
                ? formatDistanceToNow(new Date(notificacion.creadoEl), {
                    addSuffix: true,
                    locale: es,
                  })
                : "Reciente"}
            </Text>
          </HStack>
        </Box>
        {!notificacion.leido && (
          <Tooltip label="Marcar como leída">
            <IconButton
              icon={<FiCheck />}
              size="xs"
              variant="ghost"
              colorScheme="blue"
              aria-label="Marcar leída"
              flexShrink={0}
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notificacion.id);
              }}
            />
          </Tooltip>
        )}
      </HStack>
    </Box>
  );
};

NotificationItem.propTypes = {
  notificacion: PropTypes.object.isRequired,
  rolNombre: PropTypes.string,
  onMarkAsRead: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NotificationItem;
