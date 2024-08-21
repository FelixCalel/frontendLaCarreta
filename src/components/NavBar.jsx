import { Box, Flex, IconButton, Image, Spacer, HStack } from "@chakra-ui/react";
import { BellIcon, SearchIcon } from "@chakra-ui/icons"; // Importa BellIcon y SearchIcon
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./Dashboard/SearchBar";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Flex as="nav" p={{ base: "2px 4px", md: "4px 8px" }} alignItems={"center"} borderBottom="1px" top={"0"} left={"0"} width="100%" flexWrap="nowrap">
      <Box display="flex" alignItems="center" ml={{ base: "5px", md: "10px" }}>
        {/* Logo envuelto en un Link que redirige a /auth/home */}
        <Link to="/auth/home">
          <Image 
            src="/images/logo.png" // Aca va la imagen del logo
            alt="La Carreta"
            objectFit="contain" // Asegura que la imagen mantenga sus proporciones
            width={{ base: "50px", md: "70px", lg: "90px" }} // Ancho responsive más grande
            height="auto" // Altura automática
            cursor="pointer" // Cambia el cursor a pointer para indicar que es clicable
          />
        </Link>
      </Box>
       
      <Box flex={1} justifySelf="center" mx={{ base: "5px", md: "10px" }} display="flex" justifyContent="center">
        {/* Icono de búsqueda para pantallas pequeñas */}
        <Box display={{ base: "block", md: "none" }}>
          <Link to="/buscar">
            <IconButton
              variant='solid'
              aria-label="Buscar"
              icon={<SearchIcon />}
            />
          </Link>
        </Box>
        {/* Barra de búsqueda completa para pantallas más grandes */}
        <Box display={{ base: "none", md: "block" }} flex={1}>
          <SearchBar />
        </Box>
      </Box>
      <Spacer />
      <HStack spacing={{ base: "10px", md: "20px" }} pr={{ base: "5px", md: "10px" }}>
        <Link to="/notificaciones">
          <IconButton
            variant='solid'
            fontSize={{ base: "16px", md: "20px" }}
            icon={<BellIcon />}
          />
        </Link>
            
        <MenuPerfil />
      </HStack>
    </Flex>
  );
}
