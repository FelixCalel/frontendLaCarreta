import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  IconButton,
  VStack,
  useColorModeValue,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulos } from "../../store/RolPermisoUsuario/thunks";
import iconCatalog from "../Iconos/IconCatalog";
import MenuItem from "./MenuItem";

const agruparModulos = (data) => {
  if (!Array.isArray(data)) {
    console.error("Error: data no es un array. Valor recibido:", data);
    return [];
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

const MenuDesktop = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { modulos, loading } = useSelector((state) => state.modulos);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const menuRef = useRef(null);

  // Colores VERDES
  const sidebarBg = useColorModeValue("white", "gray.900");
  const sidebarBgGradient = useColorModeValue(
    "linear(to-b, white, gray.50)",
    "linear(to-b, gray.900, gray.800)",
  );
  const sidebarBorder = useColorModeValue("gray.200", "gray.700");
  const sidebarShadow = useColorModeValue(
    "2px 0 10px rgba(0, 0, 0, 0.05)",
    "2px 0 10px rgba(0, 0, 0, 0.3)",
  );
  const scrollbarThumb = useColorModeValue("#CBD5E0", "#4A5568");
  const scrollbarThumbHover = useColorModeValue("#A0AEC0", "#718096");
  const hoverBg = useColorModeValue("green.50", "green.900");
  const indicatorBg = useColorModeValue("green.400", "green.600");

  const { uid } = useSelector((state) => state.auth);

  useEffect(() => {
    if (uid) {
      dispatch(fetchModulos(uid));
    }
  }, [dispatch, uid]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsExpanded(false);
        setOpenMenus({});
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setOpenMenus({});
    }
  };

  if (loading) {
    return (
      <Box
        w="70px"
        minH="100vh"
        bg={sidebarBg}
        borderRight="1px solid"
        borderColor={sidebarBorder}
        position="sticky"
        top={0}
        left={0}
        zIndex={5}
        py={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <SkeletonCircle size="10" />
        <VStack spacing={4} w="full" px={2}>
          {[1, 2, 3, 4, 5].map((skeletonId) => (
            <Skeleton
              key={`skeleton-${skeletonId}`}
              height="40px"
              width="40px"
              borderRadius="md"
            />
          ))}
        </VStack>
      </Box>
    );
  }

  if (!modulos) {
    return null;
  }

  const modulosAgrupados = Array.isArray(modulos)
    ? agruparModulos(modulos)
    : [];

  if (!modulosAgrupados.length) {
    return null;
  }

  // Filtrar opciones con rutas dinámicas
  modulosAgrupados.forEach((m) => {
    m.opciones = m.opciones.filter((op) => !op.ruta?.includes(":"));
  });

  return (
    <Box
      ref={menuRef}
      w={isExpanded ? "260px" : "70px"}
      minH="100vh"
      bg={sidebarBg}
      bgGradient={sidebarBgGradient}
      position="sticky"
      top={0}
      left={0}
      zIndex={5}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      borderRight="1px solid"
      borderColor={sidebarBorder}
      boxShadow={sidebarShadow}
      overflowX="hidden"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: scrollbarThumb,
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: scrollbarThumbHover,
        },
      }}
    >
      {/* Botón toggle */}
      <Flex
        p={4}
        justify={isExpanded ? "space-between" : "center"}
        align="center"
        borderBottom="1px solid"
        borderColor={sidebarBorder}
        mb={2}
      >
        {isExpanded && (
          <Box
            fontWeight="bold"
            fontSize="lg"
            color="green.600"
            whiteSpace="nowrap"
            overflow="hidden"
            animation="fadeIn 0.3s"
          >
            Menú Principal
          </Box>
        )}
        <IconButton
          icon={<HamburgerIcon />}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          size="md"
          borderRadius="lg"
          variant="ghost"
          colorScheme="green"
          _hover={{
            bg: hoverBg,
            transform: "scale(1.1)",
          }}
          transition="all 0.3s ease"
        />
      </Flex>

      {/* Contenido del menú */}
      <VStack align="stretch" spacing={2} px={2}>
        {modulosAgrupados.map((modulo) => (
          <MenuItem
            key={modulo.id}
            item={modulo}
            isExpanded={isExpanded}
            toggleMenu={toggleMenu}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            currentPath={location.pathname}
            isMobileDrawer={false}
          />
        ))}
      </VStack>

      {/* Indicador visual en la parte inferior */}
      <Box
        position="absolute"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        w={isExpanded ? "80%" : "40px"}
        h="2px"
        bg={indicatorBg}
        borderRadius="full"
        transition="all 0.4s ease"
      />
    </Box>
  );
};

export default MenuDesktop;
