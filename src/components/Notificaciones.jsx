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
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { tablaPedidos, updatePedidoActivacion } from "../store/Pedidos/thunks";

export default function Notifications({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();
  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = localStorage.getItem("roleId");
  const pedidos = useSelector((state) => state.pedidos.data || []);
  const [locallyHidden, setLocallyHidden] = useState(new Set());

  const notificaciones = pedidos
    .filter((p) => p.isActive)
    .filter((pedido) => {
      if (roleId === "3") return [2, 5].includes(pedido.estadoId);
      return [3, 4, 5].includes(pedido.estadoId);
    })
    .filter((pedido) => roleId === "3" || pedido.usuarioId === usuarioId)
    .filter((p) => !locallyHidden.has(p.id))
    .sort((a, b) => new Date(b.creadoEl) - new Date(a.creadoEl));

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) onClose();
    },
  });

  const handleNotificationClick = () => {
    if (roleId === "3") {
      navigate(`/pedidos/entrantes`);
    } else if (roleId === "2") {
      navigate(`/historialPedido/listar`);
    }
  };

  const handleDeleteNotification = (pedidoId) => {
    setLocallyHidden(new Set(locallyHidden).add(pedidoId));
    dispatch(updatePedidoActivacion({ id: pedidoId, isActive: false }));
  };

  const containerBg = useColorModeValue("white", "gray.700");
  const containerTxt = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  return (
    <Box position="relative">
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

      <Collapse in={isOpen} animateOpacity>
        <Box
          ref={ref}
          pos="absolute"
          top="60px"
          right="0"
          w="320px"
          bg={containerBg}
          color={containerTxt}
          boxShadow="lg"
          p={4}
          borderRadius="lg"
          zIndex="1000"
          border="1px solid"
          borderColor={borderColor}
        >
          {notificaciones.length > 0 ? (
            notificaciones.map((pedido) => (
              <HStack
                key={pedido.id}
                justify="space-between"
                align="center"
                p={2}
                borderRadius="md"
                _hover={{ bg: hoverBg }}
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
                        {pedido.estadoId === 3
                          ? "aprobado"
                          : pedido.estadoId === 4
                          ? "cancelado"
                          : pedido.estadoId === 5
                          ? "exportado"
                          : "actualizado"}
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
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
