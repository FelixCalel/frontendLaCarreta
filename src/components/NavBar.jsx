import { Box, Flex, IconButton, Image, Spacer, HStack, Tooltip } from "@chakra-ui/react";
import { BellIcon, SearchIcon } from "@chakra-ui/icons"; // Iconos predeterminados de Chakra UI
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./Dashboard/SearchBar";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Flex
      as="nav"
      p={{ base: "4px 8px", md: "8px 16px" }} // Ajusta el padding para pantallas pequeñas y grandes
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.200" // Añade color al borde inferior
      bg="white" // Fondo blanco para contraste
      position="sticky" // Posición fija cuando se hace scroll
      top="0"
      zIndex="1000" // Asegura que esté por encima de otros elementos
      width="100%"
    >
      <Box display="flex" alignItems="center">
        {/* Logo envuelto en un Link que redirige a /auth/home */}
        <Link to="/auth/home">
          <Image
            src="/images/logo.png" // Reemplaza con la ruta correcta de tu logo
            alt="La Carreta"
            objectFit="contain"
            width={{ base: "50px", md: "70px", lg: "90px" }} // Tamaño adaptable al dispositivo
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
                icon={<SearchIcon />}
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
            <IconButton
              variant="ghost"
              fontSize={{ base: "18px", md: "22px" }} // Ajuste del tamaño del icono según el dispositivo
              icon={<BellIcon />}
            />
          </Tooltip>
        </Link>

        {/* Menú de perfil */}
        <MenuPerfil />
      </HStack>
    </Flex>
  );
}
