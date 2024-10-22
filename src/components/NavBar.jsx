import {
  Box,
  Flex,
  IconButton,
  Image,
  Spacer,
  HStack,
  Tooltip,
  Badge,
  Collapse,
  Text,
  Divider,
  useOutsideClick,
} from "@chakra-ui/react";
import { FiSearch, FiBell } from "react-icons/fi";
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./Dashboard/SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { tablaPedidos } from "../store/Pedidos/thunks";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roleId = localStorage.getItem("roleId");
  console.log("Role ID from localStorage:", roleId); // Verificar si está correctamente guardado en localStorage

  // Obtener la Lista de pedidos desde Redux
  const pedidos = useSelector((state) => state.pedidos.data || []);

  // Cargar los pedidos desde la base de datos cuando se monta el componente
  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  // Filtrar y contar los pedidos por estadoId
  const pedidosNuevos = pedidos.filter((pedido) => pedido.estadoId === 2); // Pedidos pendientes
  const countAprobados = pedidos.filter((pedido) => pedido.estadoId === 3).length;
  const countEnProceso = pedidos.filter((pedido) => pedido.estadoId === 1).length;
  const countCancelados = pedidos.filter((pedido) => pedido.estadoId === 4).length;

  // Notificaciones personalizadas para el rol 2
  const notificacionesRol2 = [
    { id: 1, mensaje: "Tienes 3 nuevas tareas asignadas." },
    { id: 2, mensaje: "Revisa los informes de la semana." },
    { id: 3, mensaje: "Nueva solicitud de reunión pendiente." },
  ];

  // Manejo del colapso del cuadro de notificaciones
  const { isOpen, onToggle, onClose } = useDisclosure();

  // Crear una referencia para el contenedor del cuadro de notificaciones
  const ref = useRef();

  // Cerrar el desplegable si se hace clic afuera
  useOutsideClick({
    ref: ref, // Referencia del contenedor del cuadro de notificaciones
    handler: () => {
      if (isOpen) {
        onClose(); // Cierra el desplegable si está abierto
      }
    },
  });

  // Función para redirigir al hacer clic en la notificación
  const handleNotificationClick = () => {
    navigate("/pedidos/entrantes");
  };

  return (
    <Flex
      as="nav"
      p={{ base: "4px 8px", md: "8px 16px" }}
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.100"
      bg="white"
      position="sticky"
      top="0"
      zIndex="1000"
      width="100%"
      boxShadow="sm"
    >
      <Box display="flex" alignItems="center">
        {/* Logo envuelto en un Link que redirige a /auth/home */}
        <Link to="/auth/home">
          <Image
            src="/images/LogoLaCarreta.png"
            alt="La Carreta"
            objectFit="contain"
            width={{ base: "40px", md: "60px", lg: "80px" }}
            cursor="pointer"
          />
        </Link>
      </Box>

      {/* Barra de búsqueda centrada */}
      <Box
        flex={1}
        mx={{ base: "5px", md: "10px" }}
        display="flex"
        justifyContent="center"
      >
        <Box display={{ base: "block", md: "none" }}>
          <Link to="/buscar">
            <Tooltip label="Buscar" aria-label="Buscar Tooltip">
              <IconButton
                variant="ghost"
                aria-label="Buscar"
                icon={<FiSearch />}
                size="lg"
              />
            </Tooltip>
          </Link>
        </Box>
        <Box display={{ base: "none", md: "block" }} flex={1}>
          <SearchBar />
        </Box>
      </Box>

      <Spacer />

      {/* Iconos del lado derecho */}
      <HStack
        spacing={{ base: "10px", md: "20px" }}
        pr={{ base: "5px", md: "10px" }}
      >
        {/* Icono de notificaciones */}
        <Tooltip label="Notificaciones" aria-label="Notificaciones Tooltip">
          <Box position="relative" onClick={onToggle}>
            <IconButton
              variant="ghost"
              fontSize={{ base: "20px", md: "24px" }}
              icon={<FiBell />}
              size="lg"
              _hover={{
                color: "blue.600",
                transform: "scale(1.05)",
              }}
              transition="all 0.2s ease-in-out"
            />
            {/* Mostrar el Badge solo si el roleId es "3" */}
            {roleId === "3" && pedidosNuevos.length > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-1px"
                right="-1px"
                fontSize="xs"
                p="4px"
              >
                {pedidosNuevos.length}
              </Badge>
            )}
            {/* Mostrar el Badge para el rol 2 si hay notificaciones personalizadas */}
            {roleId === "2" && notificacionesRol2.length > 0 && (
              <Badge
                colorScheme="blue"
                borderRadius="full"
                position="absolute"
                top="-1px"
                right="-1px"
                fontSize="xs"
                p="4px"
              >
                {notificacionesRol2.length}
              </Badge>
            )}
          </Box>
        </Tooltip>

        {/* Menú de perfil */}
        <MenuPerfil />
      </HStack>

      {/* Cuadro flotante que muestra los pedidos nuevos */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          ref={ref} // Referencia al contenedor del cuadro de notificaciones
          pos="absolute"
          top="60px"
          right="20px"
          w="320px"
          bg="white"
          boxShadow="lg"
          p={4}
          borderRadius="lg"
          zIndex="1000"
          cursor="pointer"
          backdropFilter="blur(10px)"
          border="1px solid #E2E8F0"
          transition="all 0.3s ease"
        >
          {/* Notificaciones personalizadas para el rol 3 */}
          {roleId === "3" ? (
            <>
              <Box onClick={handleNotificationClick} _hover={{ bg: "gray.50" }}>
                {pedidosNuevos.length > 0 ? (
                  <Text
                    fontWeight="medium"
                    textAlign="center"
                    color="gray.700"
                    fontSize="sm"
                  >
                    Tienes <strong>{pedidosNuevos.length}</strong> solicitudes
                    de pedidos pendientes.
                  </Text>
                ) : (
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    No hay nuevas solicitudes de pedidos.
                  </Text>
                )}
              </Box>

              <Divider my={3} />

              {/* Sección de estados de los pedidos */}
              <Box>
                <Text fontSize="md" color="gray.700" fontWeight="bold">
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
          ) : roleId === "2" ? (
            <>
              {/* Contenido visible solo para el rol 2 */}
              <Box>
                <Text fontWeight="medium" textAlign="center" color="gray.700" fontSize="sm">
                EJEMPLO  
                  Notificaciones para el Rol 2:
                </Text>
                {notificacionesRol2.map((notificacion) => (
                  <Box key={notificacion.id} mt={2} _hover={{ bg: "gray.50" }}>
                    <Text fontSize="sm" color="gray.600">
                      {notificacion.mensaje}
                    </Text>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Text textAlign="center" fontSize="sm" color="gray.500">
              No tienes notificaciones pendientes.
            </Text>
          )}
        </Box>
      </Collapse>
    </Flex>
  );
}
