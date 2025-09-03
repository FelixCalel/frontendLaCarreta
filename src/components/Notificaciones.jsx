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
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { tablaPedidos, updatePedidoActivacion } from "../store/Pedidos/thunks";
import { selectPedidosEntrantesPorRuta } from "../pages/pedidos/pedidosEntrantes/componentes/rutaSelectors";
import { tablaTienda } from "../store/Tienda/thunks";

const ESTADOS_PEDIDO_RUTA = [2, 5];
const ESTADOS_NOTIFICACION_USUARIO = [3, 4, 5];

export default function Notifications({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();
  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);
  const roleId = localStorage.getItem("roleId");
  const [locallyHidden, setLocallyHidden] = useState(new Set());
  const [visibleNotifications, setVisibleNotifications] = useState(10); // Número inicial de notificaciones visibles

  const selectPedidosRutaParaNotif = useMemo(
    () => selectPedidosEntrantesPorRuta(ESTADOS_PEDIDO_RUTA),
    []
  );
  const pedidosRuta = useSelector(selectPedidosRutaParaNotif);
  const pedidos = useSelector((state) => state.pedidos.data || []);

  const notificaciones = useMemo(() => {
    const basePedidos = roleId === "3" ? pedidosRuta : pedidos;
    return basePedidos
      .filter((p) => {
        if (!p.isActive || locallyHidden.has(p.id)) {
          return false;
        }
        if (roleId === "3") {
          return true;
        }
        return (
          p.usuarioId === usuarioId &&
          ESTADOS_NOTIFICACION_USUARIO.includes(p.estadoId)
        );
      })
      .sort((a, b) => new Date(b.creadoEl) - new Date(a.creadoEl));
  }, [pedidos, pedidosRuta, roleId, usuarioId, locallyHidden]);

  useEffect(() => {
    dispatch(tablaTienda());
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

  const loadMoreNotifications = useCallback(() => {
    setVisibleNotifications((prev) => prev + 10); // Incrementar el número de notificaciones visibles
  }, []);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreNotifications();
    }
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
          maxH="400px" // Altura máxima del contenedor
          overflowY="auto" // Habilitar desplazamiento vertical
          onScroll={handleScroll} // Manejar el evento de desplazamiento
        >
          {notificaciones.slice(0, visibleNotifications).length > 0 ? (
            notificaciones.slice(0, visibleNotifications).map((pedido) => (
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
