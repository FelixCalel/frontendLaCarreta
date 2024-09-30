import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  Tooltip,
  Collapse,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  FaShoppingCart,
  FaGlobe,
  FaBuilding,
  FaStore,
} from "react-icons/fa";
import { MdLocationCity, MdDirections } from "react-icons/md";
import PropTypes from "prop-types";

const MenuItem = ({ icon, label, to, isExpanded, isActive, onClick }) => {
  const activeBg = useColorModeValue("green.500", "green.300");
  const hoverBg = useColorModeValue("green.500", "green.500");

  return (
    <Tooltip label={isExpanded ? "" : label} placement="right" hasArrow>
      <Box
        as={Link}
        to={to}
        onClick={onClick} // Para manejar clicks personalizados
        display="flex"
        alignItems="center"
        p="2"
        justifyContent={isExpanded ? "flex-start" : "center"}
        bg={isActive ? activeBg : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={{ bg: hoverBg, color: "white", transform: "scale(1.05)" }}
        borderRadius="md"
        transition="all 0.3s ease"
        cursor="pointer" // Cambia a pointer para toda el área clicable
      >
        {icon}
        {isExpanded && <Text ml="2" fontWeight="medium">{label}</Text>}
      </Box>
    </Tooltip>
  );
};

MenuItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  isExpanded: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

const MenuPrincipalD = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPedidoSubMenu, setShowPedidoSubMenu] = useState(false); // Para mostrar el submenú
  const location = useLocation();

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const togglePedidoSubMenu = () => {
    setShowPedidoSubMenu(!showPedidoSubMenu); // Toggle para el submenú de pedidos
  };

  return (
    <Box
      w={isExpanded ? "220px" : "60px"}
      bg="green.50"
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
        bg="green.300"
        boxShadow="base"
      >
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
      <VStack align="stretch" spacing="4" pl={isExpanded ? 4 : 0} pt="6">
        <Box>
          <MenuItem
            icon={<FaShoppingCart size="24px" />}
            label="Pedidos"
            to="#" // No redirige, solo muestra el submenú
            isExpanded={isExpanded}
            isActive={location.pathname.startsWith("/pedido")}
            onClick={togglePedidoSubMenu} // Controla el submenú
          />

          {/* Submenú de pedidos */}
          <Collapse in={showPedidoSubMenu} animateOpacity>
            <VStack pl={isExpanded ? 4 : 0} spacing="2" align="stretch">
              <MenuItem
                icon={<FaShoppingCart size="18px" />}
                label="Pedidos Entrantes"
                to="/pedido/entrantes"
                isExpanded={isExpanded}
                isActive={location.pathname === "/pedido/entrantes"}
              />
              <MenuItem
                icon={<FaShoppingCart size="18px" />}
                label="Historial de Pedidos"
                to="/pedido/historial"
                isExpanded={isExpanded}
                isActive={location.pathname === "/pedido/historial"}
              />
            </VStack>
          </Collapse>
        </Box>

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
