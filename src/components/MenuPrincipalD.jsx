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
  Collapse,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { HamburgerIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { FaShoppingCart, FaInbox, FaHistory, FaStore, FaBuilding, FaGlobe } from "react-icons/fa";
import { MdLocationCity, MdDirections } from "react-icons/md";
import PropTypes from "prop-types";

// Componente MenuItem
const MenuItem = ({ icon, label, to, isExpanded, isActive }) => {
  const activeBg = useColorModeValue("green.500", "green.300");
  const hoverBg = useColorModeValue("green.500", "green.500");

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
      <Link to={to} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        {icon}
        {isExpanded && <Text ml="2" fontWeight="medium">{label}</Text>}
      </Link>
    </Flex>
  );

  return isExpanded ? menuItemContent : (
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

// Componente de "Pedidos" con submenú
const PedidoMenuItem = ({ isExpanded, location }) => {
  const [isPedidoOpen, setIsPedidoOpen] = useState(false);

  // Cerrar submenú cuando se cierra el menú principal
  useEffect(() => {
    if (!isExpanded) {
      setIsPedidoOpen(false);
    }
  }, [isExpanded]);

  return (
    <>
      <Flex
        align="center"
        p="2"
        justifyContent={isExpanded ? "flex-start" : "center"}
        bg={location.pathname.startsWith("/pedido") ? "green.500" : "transparent"}
        color={location.pathname.startsWith("/pedido") ? "white" : "inherit"}
        _hover={{ bg: "green.500", color: "white", cursor: "pointer" }}
        borderRadius="md"
        transition="all 0.3s ease"
      >
        <Box display="flex" alignItems="center" flex={1}>
          <Link  style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <FaShoppingCart size="24px" />
            {isExpanded && <Text ml="2" fontWeight="medium">Pedido</Text>}
          </Link>
        </Box>
        {/* Icono para abrir/cerrar submenú */}
        {isExpanded && (
          <Box onClick={() => setIsPedidoOpen(!isPedidoOpen)}>
            {isPedidoOpen ? <ChevronUpIcon fontSize="24px" /> : <ChevronDownIcon fontSize="24px" />}
          </Box>
        )}
      </Flex>

      {/* Submenú */}
      <Collapse in={isPedidoOpen} animateOpacity>
        <VStack align="stretch" pl={isExpanded ? 1 : 0} spacing={2}>
        <MenuItem
            icon={<FaInbox size="20px" />}
            label="Crear Pedido"
            to="/pedido/listar"
            isExpanded={isExpanded}
            isActive={location.pathname === "/pedido/listar"}
          />
          <MenuItem
            icon={<FaInbox size="20px" />}
            label="Pedidos Entrantes"
            to="/pedidos/entrantes"
            isExpanded={isExpanded}
            isActive={location.pathname === "/pedidos/entrantes"}
          />
          <MenuItem
            icon={<FaHistory size="20px" />}
            label="Historial de Pedidos"
            to="/pedido/historial"
            isExpanded={isExpanded}
            isActive={location.pathname === "/pedido/historial"}
          />
        </VStack>
      </Collapse>
    </>
  );
};

PedidoMenuItem.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
};

// Componente principal del menú
const MenuPrincipalD = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Desactivar el menú en pantallas móviles
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  return (
    <Box
      w={isExpanded ? { base: "150px", md: "180px" } : "60px"}
      bg="green.50"
      transition="width 0.3s ease"
      boxShadow="md"
      borderRadius="md"
      overflow="hidden"
      height="100vh"
    >
      {/* Toggle Menu */}
      <Flex align="center" justifyContent="center" h="60px" bg="green.300" boxShadow="base">
        <IconButton
          icon={<HamburgerIcon />}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Menu"
          size="lg"
          bg="green.400"
          color="white"
          _hover={{ bg: "green.500" }}
          transition="background-color 0.2s ease"
        />
      </Flex>

      {/* Contenido del menú */}
      <VStack align="stretch" spacing="4" pl={isExpanded ? 1 : 0} pt="6">
        {/* Menú de Pedidos con submenú */}
        <PedidoMenuItem isExpanded={isExpanded} location={location} />
        {/* Otros ítems del menú */}
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

MenuPrincipalD.propTypes = {
  location: PropTypes.object,
};

export default MenuPrincipalD;
