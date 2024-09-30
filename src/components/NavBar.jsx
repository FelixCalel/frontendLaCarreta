import { Box, Flex, IconButton, Image, Spacer, HStack, Tooltip, Badge } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { FiBell } from "react-icons/fi"; // Iconos modernos usando react-icons
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./Dashboard/SearchBar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Para acceder a los pedidos desde Redux

export default function NavBar() {
  // Obtener la Lista de pedidos desde Redux
  const pedidos = useSelector((state) => state.pedidos.data);

  // Filtrar los pedidos con estadoId 2 (pedidos nuevos)
  const pedidosNuevos = pedidos.filter((pedido) => pedido.estadoId === 2);

  return (
    <Flex
      as="nav"
      p={{ base: "4px 8px", md: "8px 16px" }} // Mantén el padding adaptable
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.100" // Un color más claro para el borde inferior
      bg="white" // Fondo blanco para mantener el contraste
      position="sticky"
      top="0"
      zIndex="1000" // Asegura que esté por encima de otros elementos
      width="100%"
      boxShadow="sm" // Sombra suave para dar un toque minimalista
    >
      <Box display="flex" alignItems="center">
        {/* Logo envuelto en un Link que redirige a /auth/home */}
        <Link to="/auth/home">
          <Image
            src="/images/LogoLaCarreta.png" // Reemplaza con la ruta correcta de tu logo
            alt="La Carreta"
            objectFit="contain"
            width={{ base: "40px", md: "60px", lg: "80px" }} // Tamaño adaptable al dispositivo
            cursor="pointer" // Muestra un cursor de pointer
          />
        </Link>
      </Box>

      {/* Barra de búsqueda centrada */}
      <Box flex={1} mx={{ base: "5px", md: "10px" }} display="flex" justifyContent="center">
        {/* Icono de búsqueda para pantallas pequeñas */}
        <Box display={{ base: "block", md: "none" }}>
          <Link to="/buscar">
            <Tooltip label="Buscar" aria-label="Buscar Tooltip">
              <IconButton
                variant="ghost"
                aria-label="Buscar"
                icon={<FiSearch />} // Cambiado a un icono más moderno
                size="lg"
              />
            </Tooltip>
          </Link>
        </Box>
        {/* Barra de búsqueda completa para pantallas más grandes */}
        <Box display={{ base: "none", md: "block" }} flex={1}>
          <SearchBar />
        </Box>
      </Box>

      <Spacer /> {/* Espaciador para alinear los elementos */}
      
      {/* Iconos del lado derecho */}
      <HStack spacing={{ base: "10px", md: "20px" }} pr={{ base: "5px", md: "10px" }}>
        <Link to="/notificaciones">
          <Tooltip label="Notificaciones" aria-label="Notificaciones Tooltip">
            <Box position="relative">
              <IconButton
                variant="ghost"
                fontSize={{ base: "20px", md: "24px" }} // Ajuste del tamaño del icono según el dispositivo
                icon={<FiBell />} // Cambiado a un icono de campana más moderno
                size="lg"
              />
              {/* Si hay pedidos nuevos, mostramos el número */}
              {pedidosNuevos.length > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-1px"
                  right="-1px"
                  fontSize="xs" // Tamaño de fuente pequeño para que sea discreto
                  p="4px" // Padding pequeño para que el badge no sea muy grande
                >
                  {pedidosNuevos.length}
                </Badge>
              )}
            </Box>
          </Tooltip>
        </Link>

        {/* Menú de perfil */}
        <MenuPerfil />
      </HStack>
    </Flex>
  );
}
