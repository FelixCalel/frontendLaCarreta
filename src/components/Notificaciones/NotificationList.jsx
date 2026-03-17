import PropTypes from "prop-types";
import {
  Box,
  VStack,
  Divider,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import NotificationItem from "./NotificationItem";

const NotificationList = ({
  notificaciones,
  rolNombre,
  onMarkAsRead,
  onNotificationClick,
}) => {
  const containerBorder = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      maxH="320px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.300",
          borderRadius: "24px",
        },
      }}
    >
      {notificaciones.length > 0 ? (
        <VStack
          spacing={0}
          align="stretch"
          divider={<Divider borderColor={containerBorder} />}
        >
          {notificaciones.map((notificacion, index) => (
            <NotificationItem
              key={notificacion.id ?? `notif-${index}`}
              notificacion={notificacion}
              rolNombre={rolNombre}
              onMarkAsRead={onMarkAsRead}
              onClick={onNotificationClick}
            />
          ))}
        </VStack>
      ) : (
        <Flex
          direction="column"
          align="center"
          justify="center"
          p={4}
          color={mutedColor}
        >
          <Icon as={FiBell} boxSize={7} mb={2} color="gray.300" />
          <Text fontSize="xs">No tienes notificaciones</Text>
        </Flex>
      )}
    </Box>
  );
};

NotificationList.propTypes = {
  notificaciones: PropTypes.array.isRequired,
  rolNombre: PropTypes.string,
  onMarkAsRead: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
};

export default NotificationList;
