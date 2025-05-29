import { useState, useEffect, useRef } from "react";
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
import {
  HamburgerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulos } from "../store/RolPermisoUsuario/thunks";
import iconCatalog from "../components/Iconos/IconCatalog";

const MenuItem = ({
  item,
  isExpanded,
  toggleMenu,
  indentLevel = 0,
  openMenus,
  setOpenMenus,
  currentPath,
}) => {
  const isOpen = openMenus[item.nombre] || false;
  const hasChildren = item.opciones && item.opciones.length > 0;
  const linkBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const bgColorSecondary = useColorModeValue("gray.50", "gray.600");
  const textColorSecondary = useColorModeValue("gray.600", "gray.300");
  const location = useLocation();
  const isActive = item.ruta
    ? currentPath === item.ruta || currentPath.startsWith(item.ruta + "/")
    : false;

  const [open, setOpen] = useState(isActive);

  const handleToggle = (e) => {
    if (!isExpanded) {
      toggleMenu();
    }
    if (hasChildren) {
      e.stopPropagation();
      setOpenMenus((prev) => ({
        ...prev,
        [item.nombre]: !isOpen,
      }));
    }
  };

  useEffect(() => {
    if (hasChildren) {
      const childActive = item.opciones?.some((sub) =>
        currentPath.startsWith(sub.ruta)
      );
      setOpen(isActive || childActive);
    }
  }, [currentPath, isActive, hasChildren, item.opciones]);

  return (
    <Flex
      direction="column"
      alignItems="start"
      ml={isExpanded ? indentLevel * 2 : "4px"}
      width="100%"
    >
      <Flex
        align="center"
        p="2"
        cursor="pointer"
        w="full"
        onClick={handleToggle}
        bg={isOpen ? (indentLevel === 0 ? linkBg : bgColorSecondary) : ""}
        borderRadius="md"
        _hover={{ bg: linkBg }}
        transition="background 0.3s ease"
      >
        <Link
          to={item.ruta || "#"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            columnGap: "8px",
            textDecoration: "none",
            flex: 1,
          }}
        >
          <Box as={item.icono} marginRight="8px" />
          {isExpanded && (
            <Text
              ml="2"
              color={indentLevel === 0 ? textColor : textColorSecondary}
              fontWeight={indentLevel === 0 ? "medium" : "normal"}
              fontSize={indentLevel === 0 ? "md" : "sm"}
            >
              {item.nombre}
            </Text>
          )}
        </Link>
        {hasChildren && isExpanded && (
          <IconButton
            aria-label="Toggle Submenu"
            icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            size="sm"
            marginLeft="auto"
            variant="ghost"
          />
        )}
      </Flex>
      {isOpen && hasChildren && (
        <Collapse in={isOpen} animateOpacity style={{ width: "100%" }}>
          <VStack pl={4} bg={indentLevel === 0 ? linkBg : bgColorSecondary}>
            {item.opciones.map((subItem) => (
              <MenuItem
                key={subItem.id}
                item={subItem}
                isExpanded={isExpanded}
                toggleMenu={toggleMenu}
                indentLevel={indentLevel + 1}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
                currentPath={location.pathname}
              />
            ))}
          </VStack>
        </Collapse>
      )}
    </Flex>
  );
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    ruta: PropTypes.string,
    icono: PropTypes.elementType,
    opciones: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        ruta: PropTypes.string,
        icono: PropTypes.elementType,
      })
    ),
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  indentLevel: PropTypes.number,
  openMenus: PropTypes.object.isRequired,
  setOpenMenus: PropTypes.func.isRequired,
  currentPath: PropTypes.string.isRequired,
};

const agruparModulos = (data) => {
  if (!Array.isArray(data)) {
    console.error("Error: data no es un array. Valor recibido:", data);
  }

  const modulosAgrupados = {};

  data.forEach((entry) => {
    const moduloId = entry.modulo.id;
    const IconoModulo = iconCatalog[entry.modulo.icono];
    const IconoOpcion = iconCatalog[entry.opcion.icono];

    if (!modulosAgrupados[moduloId]) {
      modulosAgrupados[moduloId] = {
        id: entry.modulo.id,
        nombre: entry.modulo.nombre,
        ruta: entry.modulo.ruta,
        icono: IconoModulo,
        opciones: [],
      };
    }

    modulosAgrupados[moduloId].opciones.push({
      id: entry.opcion.id,
      nombre: entry.opcion.nombre,
      ruta: entry.opcion.ruta,
      icono: IconoOpcion,
    });
  });

  return Object.values(modulosAgrupados);
};

const PEDIDO_ROUTES = ["/pedido", "/historialPedido"];

const MenuPrincipalD = () => {
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const dispatch = useDispatch();
  const { modulos, loading } = useSelector((state) => state.modulos);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const boxBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("white", "gray.900"); // ⬅️  más oscuro
  const sidebarBorder = useColorModeValue("gray.200", "gray.700");
  const menuRef = useRef(null);

  const menuWidth = useBreakpointValue({
    base: "200px",
    md: "150px",
    lg: "200px",
  });

  useEffect(() => {
    const UsuarioId = localStorage.getItem("usuarioId");
    if (UsuarioId) {
      dispatch(fetchModulos(UsuarioId));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = () => {};
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const enModuloPedido = PEDIDO_ROUTES.some((route) =>
      location.pathname.startsWith(route)
    );

    if (isMobile && enModuloPedido) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isMobile, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        const enModuloPedido = PEDIDO_ROUTES.some((route) =>
          location.pathname.startsWith(route)
        );

        if (isMobile && enModuloPedido) {
          setOpenMenus({});
        } else {
          setIsExpanded(false);
          setOpenMenus({});
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, location.pathname]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setOpenMenus({});
    }
  };

  if (!modulos || loading) {
    return null;
  }

  const modulosAgrupados = Array.isArray(modulos)
    ? agruparModulos(modulos)
    : [];

  if (loading) {
    return <div>Cargando módulos...</div>;
  }

  if (!modulosAgrupados.length) {
    return <div>No hay módulos disponibles.</div>;
  }

  return (
    <Box
      ref={menuRef}
      w={isExpanded ? menuWidth : "60px"}
      bg={sidebarBg}
      position={isExpanded ? "absolute" : "relative"}
      top={isExpanded ? "16px" : 0}
      zIndex={isExpanded ? 10 : "auto"}
      transition="width 0.5s"
      p={2}
      boxShadow="base"
      borderRight={`1px solid ${sidebarBorder}`}
    >
      <IconButton
        icon={isExpanded ? <CloseIcon /> : <HamburgerIcon />}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        isRound
        variant="ghost"
        mb={4}
      />
      <VStack align="stretch" spacing={1}>
        {modulosAgrupados.map((modulo) => (
          <MenuItem
            key={modulo.id}
            item={modulo}
            isExpanded={isExpanded}
            toggleMenu={toggleMenu}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            currentPath={location.pathname}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default MenuPrincipalD;
