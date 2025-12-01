import PropTypes from "prop-types";
import { Box, VStack, Divider, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notificaciones, onMarkAsRead, onNotificationClick }) => {
  const containerBorder = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  const unreadNotifications = notificaciones.filter((n) => !n.leido);

  return (
    <Box
      maxH="400px"
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
      {unreadNotifications.length > 0 ? (
        <VStack
          spacing={0}
          align="stretch"
          divider={<Divider borderColor={containerBorder} />}
        >
          {unreadNotifications.map((notificacion) => (
            <NotificationItem
              key={notificacion.id || Math.random()}
              notificacion={notificacion}
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
          p={8}
          color={mutedColor}
        >
          <Icon as={FiBell} boxSize={10} mb={3} color="gray.300" />
          <Text fontSize="sm">No tienes notificaciones</Text>
        </Flex>
      )}
    </Box>
  );
};

NotificationList.propTypes = {
  notificaciones: PropTypes.array.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
};

export default NotificationList;
