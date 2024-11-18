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
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { tablaPedidos } from "../store/Pedidos/thunks";

export default function Notifications({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();

  // Obtener el rol del usuario desde el localStorage
  const roleId = localStorage.getItem("roleId");

  // Pedidos desde Redux
  const pedidos = useSelector((state) => state.pedidos.data || []);
  const [notificaciones, setNotificaciones] = useState([]);

  // Recuperar notificaciones eliminadas desde el localStorage
  const [deletedNotifications, setDeletedNotifications] = useState(() => {
    const storedDeleted = localStorage.getItem(`deletedNotifications_${roleId}`);
    return storedDeleted ? JSON.parse(storedDeleted) : [];
  });

  // Actualizar el localStorage cuando cambien las notificaciones eliminadas
  useEffect(() => {
    localStorage.setItem(`deletedNotifications_${roleId}`, JSON.stringify(deletedNotifications));
  }, [deletedNotifications, roleId]);

  // Filtrar y ordenar pedidos según los estados y el rol
  useEffect(() => {
    if (roleId === "3") {
      // Para rol 3 (pedidos pendientes)
      const pendientes = pedidos
        .filter(
          (pedido) =>
            pedido.estadoId === 2 && !deletedNotifications.includes(pedido.id)
        )
        .sort((a, b) => new Date(b.fechaOrden) - new Date(a.fechaOrden)); // Ordenar por fecha descendente
      setNotificaciones(pendientes);
    } else if (roleId === "2") {
      // Para rol 2 (pedidos aprobados o cancelados)
      const usuarioPedidos = pedidos
        .filter(
          (pedido) =>
            (pedido.estadoId === 3 || pedido.estadoId === 4) &&
            !deletedNotifications.includes(pedido.id)
        )
        .sort((a, b) => new Date(b.fechaOrden) - new Date(a.fechaOrden)); // Ordenar por fecha descendente
      setNotificaciones(usuarioPedidos);
    }
  }, [pedidos, roleId, deletedNotifications]);

  useEffect(() => {
    // Obtener pedidos desde la base de datos al cargar el componente
    dispatch(tablaPedidos());
  }, [dispatch]);

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) onClose();
    },
  });

  const handleNotificationClick = (pedidoId) => {
    if (roleId === "3") {
      navigate("/pedidos/entrantes");
    } else if (roleId === "2") {
      navigate("/historialPedido/listar");
    }
  };

  const handleDeleteNotification = (pedidoId) => {
    // Agregar la notificación a la lista de eliminadas y actualizar el localStorage
    setDeletedNotifications((prev) => [...prev, pedidoId]);
  };

  // Conteo de estados para el rol 3
  const countAprobados = pedidos.filter((pedido) => pedido.estadoId === 3).length;
  const countEnProceso = pedidos.filter((pedido) => pedido.estadoId === 1).length;
  const countCancelados = pedidos.filter((pedido) => pedido.estadoId === 4).length;

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
                  onClick={() => handleNotificationClick(pedido.id)}
                  cursor="pointer"
                  flex={1}
                >
                  {roleId === "3" ? (
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Tienes un pedido pendiente: <strong>ID: {pedido.id}</strong>.
                    </Text>
                  ) : (
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Tu pedido <strong>ID: {pedido.id}</strong> ha sido{" "}
                      <strong>
                        {pedido.estadoId === 3 ? "aprobado" : "cancelado"}
                      </strong>.
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
              <Box>
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
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
