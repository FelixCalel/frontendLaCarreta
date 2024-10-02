import { Box, Flex, IconButton, Image, Spacer, HStack, Tooltip, Badge, Collapse, Text, Divider } from "@chakra-ui/react";
import { FiSearch, FiBell } from "react-icons/fi";
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./Dashboard/SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { tablaPedidos } from "../store/Pedidos/thunks";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Obtener la Lista de pedidos desde Redux
  const pedidos = useSelector((state) => state.pedidos.data || []); // Asegúrate de que pedidos sea un array

  // Cargar los pedidos desde la base de datos cuando se monta el componente
  useEffect(() => {
    dispatch(tablaPedidos()); // Asegúrate de que los datos estén actualizados
  }, [dispatch]);

  // Filtrar y contar los pedidos por estadoId
  const pedidosNuevos = pedidos.filter((pedido) => pedido.estadoId === 2); // Pedidos pendientes
const countAprobados = pedidos.filter(pedido => pedido.estadoId === 3).length;
const countEnProceso = pedidos.filter(pedido => pedido.estadoId === 1).length;
const countCancelados = pedidos.filter((pedido) => pedido.estadoId === 4).length;


  // Manejo del colapso del cuadro de notificaciones
  const { isOpen, onToggle } = useDisclosure();

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
      <Box flex={1} mx={{ base: "5px", md: "10px" }} display="flex" justifyContent="center">
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
      <HStack spacing={{ base: "10px", md: "20px" }} pr={{ base: "5px", md: "10px" }}>
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
            {/* Si hay pedidos nuevos, mostramos el número */}
            {pedidosNuevos.length > 0 && (
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
          </Box>
        </Tooltip>

        {/* Menú de perfil */}
        <MenuPerfil />
      </HStack>

      {/* Cuadro flotante que muestra los pedidos nuevos */}
      <Collapse in={isOpen} animateOpacity>
        <Box
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
          {/* Sección de notificaciones de pedidos pendientes */}
          <Box onClick={handleNotificationClick} _hover={{ bg: "gray.50" }}>
            {pedidosNuevos.length > 0 ? (
              <Text fontWeight="medium" textAlign="center" color="gray.700" fontSize="sm">
                Tienes <strong>{pedidosNuevos.length}</strong> solicitudes de pedidos pendientes.
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
                Aprobados: {countAprobados} {/* Mostrar cantidad de pedidos aprobados */}
              </Text>
              <Text fontSize="sm" color="yellow.600">
                En Proceso: {countEnProceso} {/* Mostrar cantidad de pedidos en proceso */}
              </Text>
              <Text fontSize="sm" color="red.600">
                Cancelados: {countCancelados} {/* Mostrar cantidad de pedidos cancelados */}
              </Text>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Flex>
  );
}
