import {
  Box,
  Flex,
  IconButton,
  Image,
  Spacer,
  HStack,
  Tooltip,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { MenuPerfil } from "./MenuPerfil";
import Notifications from "./Notificaciones";
import SearchBar from "./component/searchBar";
import { useSearch } from "./component/SearchContext";

export default function NavBar() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { setQuery } = useSearch();
  const handleSearch = (q) => setQuery(q);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      p={{ base: "4px 8px", md: "8px 16px" }}
      alignItems="center"
      borderBottom="1px solid"
      borderColor={colorMode === "light" ? "gray.100" : "gray.700"}
      bg={colorMode === "light" ? "white" : "gray.900"}
      position="sticky"
      top="0"
      zIndex="1000"
      width="100%"
      boxShadow="sm"
    >
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
          <SearchBar onSearch={handleSearch} />
        </Box>
      </Box>

      <Spacer />

      <HStack spacing={{ base: "10px", md: "20px" }}>
        <IconButton
          variant="ghost"
          aria-label="Toggle Color Mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />

        <Notifications isOpen={isOpen} onToggle={onToggle} onClose={onClose} />

        <MenuPerfil />
      </HStack>
    </Flex>
  );
}
