import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { FaShoppingCart, FaHistory, FaInbox, FaGlobe, FaBuilding, FaStore } from "react-icons/fa";
import { MdLocationCity, MdDirections } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";

// Componente MenuItem con validación de PropTypes
const MenuItem = ({ icon, label, to, isExpanded, isActive }) => {
  const activeBg = useColorModeValue("green.500", "green.300");
  const hoverBg = useColorModeValue("green.500", "green.500");

  return (
    <Flex
      align="center"
      p="2"
      justifyContent={isExpanded ? "flex-start" : "center"}
      bg={isActive ? activeBg : "transparent"}
      color={isActive ? "white" : "inherit"}
      _hover={{ bg: hoverBg, color: "white", transform: "scale(1.05)" }}
      borderRadius="md"
      transition="all 0.3s ease"
      width="100%"
    >
      <Link
        to={to}
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          width: "100%",
        }}
      >
        {icon}
        {isExpanded && <Text ml="2" fontWeight="medium">{label}</Text>}
      </Link>
    </Flex>
  );
};

MenuItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

// Modificar esta parte del menú de "Pedidos"
const PedidoMenuItem = ({ isExpanded, location, resetSubmenu }) => {
  const [isPedidoOpen, setIsPedidoOpen] = useState(false);

  // Cerrar el submenú si el toggle del menú principal está cerrado
  React.useEffect(() => {
    if (!isExpanded) {
      setIsPedidoOpen(false);
    }
  }, [isExpanded]);

  return (
    <>
      {/* "Pedido" redirige a /pedido/listar */}
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
        <Box
          display="flex"
          alignItems="center"
          flex={1}
          onClick={() => (isExpanded ? setIsPedidoOpen(!isPedidoOpen) : null)}
          style={{ cursor: "pointer" }} // Cambia a un puntero de clic
        >
          <Link
            to="/pedido/listar"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flex: 1,
            }}
          >
            <FaShoppingCart size="24px" />
            {isExpanded && <Text ml="2" fontWeight="medium">Pedido</Text>}
          </Link>
        </Box>
        {/* Icono de desplegable para submenú */}
        {isExpanded && (
          <Box onClick={() => setIsPedidoOpen(!isPedidoOpen)}>
            {isPedidoOpen ? (
              <ChevronUpIcon fontSize="24px" />
            ) : (
              <ChevronDownIcon fontSize="24px" />
            )}
          </Box>
        )}
      </Flex>

      {/* Submenú de Pedidos */}
      <Collapse in={isPedidoOpen} animateOpacity>
        <VStack align="stretch" pl={isExpanded ? 4 : 0} spacing={2}>
          <MenuItem
            icon={<FaInbox size="20px" />}
            label="Pedidos Entrantes"
            to="/pedido/entrantes"
            isExpanded={isExpanded}
            isActive={location.pathname === "/pedido/entrantes"}
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
  resetSubmenu: PropTypes.func,
};

// Componente principal del menú
const MenuPrincipalD = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Tamaño del menú adaptable a pantallas pequeñas
  const menuWidth = useBreakpointValue({ base: "60px", md: isExpanded ? "220px" : "60px" });

  return (
    <Box
      w={menuWidth}
      bg="green.50"
      transition="width 0.3s ease"
      boxShadow="md"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Botón de menú hamburguesa */}
      <Flex
        align="center"
        justifyContent="center"
        h="60px"
        bg="green.300"
        boxShadow="base"
      >
        <IconButton
          icon={<AiOutlineMenu />} // Icono de hamburguesa
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
      <VStack align="stretch" spacing="4" pl={isExpanded ? 4 : 0} pt="6">
        {/* Menú de Pedidos con su propio submenú */}
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
  location: PropTypes.object.isRequired,
};

export default MenuPrincipalD;
