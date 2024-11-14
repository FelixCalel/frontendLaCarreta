import { useState, useEffect, useRef } from "react";
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
import { Link } from "react-router-dom";
import {
  HamburgerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulos } from "../store/RolPermisoUsuario/thunks";
import {
  FaHistory,
  FaInbox,
  FaBuilding,
  FaStore,
  FaGlobe,
  FaClipboardList,
  FaShoppingCart,
  FaTools,
} from "react-icons/fa";
import { MdLocationCity, MdDirections, MdPerson } from "react-icons/md";

// Mapa de iconos
const iconMap = {
  FaInbox: FaInbox,
  FaHistory: FaHistory,
  FaBuilding: FaBuilding,
  FaStore: FaStore,
  FaGlobe: FaGlobe,
  MdLocationCity: MdLocationCity,
  MdDirections: MdDirections,
  FaClipboardList: FaClipboardList,
  FaShoppingCart: FaShoppingCart,
  FaTools: FaTools,
  MdPerson: MdPerson,
};

// Componente MenuItem
const MenuItem = ({
  item,
  isExpanded,
  toggleMenu,
  indentLevel = 0,
  openMenus,
  setOpenMenus,
}) => {
  const isOpen = openMenus[item.nombre] || false;
  const hasChildren = item.opciones && item.opciones.length > 0;
  const linkBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const bgColorSecondary = useColorModeValue("gray.50", "gray.600");
  const textColorSecondary = useColorModeValue("gray.600", "gray.300");

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
              />
            ))}
          </VStack>
        </Collapse>
      )}
    </Flex>
  );
};

// Función para agrupar opciones bajo módulos por `modulo_id`
const agruparModulos = (data) => {
  const modulosAgrupados = {};

  data.forEach((entry) => {
    const moduloId = entry.modulo.id;
    const IconoModulo = iconMap[entry.modulo.icono];
    const IconoOpcion = iconMap[entry.opcion.icono];

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

// Componente principal del menú
const MenuPrincipalD = () => {
  const dispatch = useDispatch();
  const { modulos, loading } = useSelector((state) => state.modulos);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const boxBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuRef = useRef(null);

  // Responsive width
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
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsExpanded(false);
        setOpenMenus({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setOpenMenus({});
    }
  };

  // Renderizar el contenido solo si `modulos` está cargado y `loading` es falso
  if (!modulos || loading) {
    return null; // No muestra nada mientras carga
  }

  const modulosAgrupados = agruparModulos(modulos);

  if (modulosAgrupados.length === 0) {
    return <div>No hay módulos disponibles.</div>;
  }

  return (
    <Box
      ref={menuRef}
      w={isExpanded ? menuWidth : "60px"}
      bg={boxBg}
      position={isExpanded ? "absolute" : "relative"}
      top={0}
      zIndex={isExpanded ? 10 : "auto"}
      transition="width 0.5s"
      p={4}
      boxShadow="base"
      borderRight={`1px solid ${borderColor}`}
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
          />
        ))}
      </VStack>
    </Box>
  );
};

export default MenuPrincipalD;
