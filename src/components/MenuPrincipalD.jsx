import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaShoppingCart, FaGlobe, FaBuilding, FaStore } from "react-icons/fa";
import { MdLocationCity, MdDirections } from "react-icons/md";
import PropTypes from "prop-types";

// Componente MenuItem rediseñado con animación
const MenuItem = ({ icon, label, to, isExpanded, isActive }) => {
  const activeBg = useColorModeValue("green.500", "green.300");
  const hoverBg = useColorModeValue("green.100", "green.700");

  const menuItemContent = (
    <Flex
      align="center"
      p="2"
      justifyContent={isExpanded ? "flex-start" : "center"}
      bg={isActive ? activeBg : "transparent"}
      color={isActive ? "white" : "inherit"}
      _hover={{ bg: hoverBg, color: "white", transform: "scale(1.05)" }}
      borderRadius="md"
      transition="all 0.3s ease"
    >
      <Link
        to={to}
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        {icon}
        {isExpanded && <Text ml="2" fontWeight="medium">{label}</Text>}
      </Link>
    </Flex>
  );

  return isExpanded ? (
    menuItemContent
  ) : (
    <Tooltip label={label} placement="right" hasArrow>
      {menuItemContent}
    </Tooltip>
  );
};

MenuItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const MenuPrincipalD = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isExpanded, setIsExpanded] = useState(false); // Comienza contraído
  const location = useLocation();

  // Evitar que el menú se expanda en la carga
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  return (
    <Box
      w={isExpanded ? "220px" : "60px"}
      bg="green.50"  // Fondo verde claro
      transition="width 0.3s ease"
      boxShadow="md"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Encabezado del menú */}
      <Flex
        align="center"
        justifyContent="center"
        h="60px"
        bg="green.300"  // Fondo del icono hamburguesa en verde
        boxShadow="base"
      >
        <IconButton
          icon={<HamburgerIcon />}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Menu"
          size="lg"
          bg="green.400"  // Fondo verde del icono
          color="white"  // Color del icono
          _hover={{ bg: "green.500" }}  // Fondo más oscuro al hacer hover
          transition="background-color 0.2s ease"
        />
      </Flex>
      {/* Contenido del menú */}
      <VStack align="stretch" spacing="4" pl={isExpanded ? 4 : 0} pt="6">
        <MenuItem
          icon={<FaShoppingCart size="24px" />}
          label="Pedido"
          to="/pedido/listar"
          isExpanded={isExpanded}
          isActive={location.pathname === "/pedido/listar"}
        />
        <MenuItem
          icon={<MdDirections size="24px" />}
          label="Rutas"
          to="/ruta/listar"
          isExpanded={isExpanded}
          isActive={location.pathname === "/ruta/listar"}
        />
        <MenuItem
          icon={<MdLocationCity size="24px" />}
          label="Departamento"
          to="/ciudad/listar"
          isExpanded={isExpanded}
          isActive={location.pathname === "/ciudad/listar"}
        />
        <MenuItem
          icon={<FaStore size="24px" />}
          label="Sucursal"
          to="/tienda/listar"
          isExpanded={isExpanded}
          isActive={location.pathname === "/tienda/listar"}
        />
        <MenuItem
          icon={<FaBuilding size="24px" />}
          label="Empresas"
          to="/empresa/listar"
          isExpanded={isExpanded}
          isActive={location.pathname === "/empresa/listar"}
        />
        <MenuItem
          icon={<FaGlobe size="24px" />}
          label="País"
          to="/pais/listar"
          isExpanded={isExpanded}
          isActive={location.pathname === "/pais/listar"}
        />
      </VStack>
    </Box>
  );
};

export default MenuPrincipalD;
