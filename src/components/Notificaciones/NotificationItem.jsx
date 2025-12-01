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
    label: "INFO",
    badgeScheme: "blue",
    bgLight: "blue.50",
    bgDark: "blue.900",
    border: "blue.400",
  },
};

const NotificationItem = ({ notificacion, onMarkAsRead, onClick }) => {
  const styles = typeStyles[notificacion.tipo] || typeStyles.info;
  
  const bg = useColorModeValue(styles.bgLight, styles.bgDark);
  const hoverBg = useColorModeValue("blue.50", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      p={4}
      bg={notificacion.leido ? "transparent" : bg}
      borderLeft="4px solid"
      borderColor={notificacion.leido ? "transparent" : styles.border}
      _hover={{ bg: hoverBg, cursor: "pointer" }}
      onClick={() => onClick(notificacion)}
      transition="all 0.2s"
      position="relative"
    >
      <HStack align="start" spacing={3}>
        <Box mt={1}>
          <Icon as={styles.icon} color={styles.iconColor} boxSize={5} />
        </Box>
        <Box flex={1}>
          <HStack justify="space-between" mb={1}>
            <Text
              fontSize="sm"
              fontWeight={notificacion.leido ? "normal" : "bold"}
            >
              {notificacion.titulo || "Notificación"}
            </Text>
            <Badge colorScheme={styles.badgeScheme} fontSize="0.6em">
              {styles.label}
            </Badge>
          </HStack>
          <Text fontSize="xs" color={mutedColor} noOfLines={2} mb={2}>
            {notificacion.mensaje || "Tienes una nueva notificación"}
          </Text>
          <HStack spacing={1} color={mutedColor}>
            <Icon as={FiClock} boxSize={3} />
            <Text fontSize="xs">
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
  onMarkAsRead: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NotificationItem;
