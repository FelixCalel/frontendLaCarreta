import {
  Box,
  Flex,
  IconButton,
  Image,
  Spacer,
  HStack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./component/searchBar";
import Notifications from "./Notificaciones";

export default function NavBar() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  // Función de búsqueda
  const handleSearch = (query) => {
    console.log("Búsqueda realizada:", query);
    // Implementar lógica de búsqueda aquí (navegación, API, etc.)
  };

  // Acción al hacer clic en una sugerencia
  const handleSuggestionClick = (suggestion) => {
    console.log("Sugerencia seleccionada:", suggestion);
    // Implementar lógica para manejar sugerencias aquí
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
      {/* Logo */}
      <Box display="flex" alignItems="center">
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

      {/* Barra de búsqueda */}
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
          <SearchBar onSearch={handleSearch} onSuggestionClick={handleSuggestionClick} />
        </Box>
      </Box>

      <Spacer />

      {/* Iconos del lado derecho */}
      <HStack spacing={{ base: "10px", md: "20px" }}>
        {/* Notificaciones */}
        <Notifications isOpen={isOpen} onToggle={onToggle} onClose={onClose} />

        {/* Menú de perfil */}
        <MenuPerfil />
      </HStack>
    </Flex>
  );
}
