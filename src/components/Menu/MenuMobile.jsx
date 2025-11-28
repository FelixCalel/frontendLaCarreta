import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  IconButton,
  keyframes,
  Skeleton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulos } from "../../store/RolPermisoUsuario/thunks";
import iconCatalog from "../Iconos/IconCatalog";
import MenuItem from "./MenuItem";

// Animaciones
const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

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

const MenuMobile = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { modulos, loading } = useSelector((state) => state.modulos);
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  // Colores VERDES - todos los hooks al inicio
  const buttonBg = useColorModeValue("green.500", "green.600");
  const buttonHoverBg = useColorModeValue("green.600", "green.700");
  const menuBg = useColorModeValue("white", "gray.800");
  const headerBorderColor = useColorModeValue("gray.200", "gray.700");
  const menuTitleColor = useColorModeValue("green.600", "green.400");
  const closeButtonHoverBg = useColorModeValue("green.50", "green.900");

  useEffect(() => {
    const UsuarioId = localStorage.getItem("usuarioId");
    if (UsuarioId) {
      dispatch(fetchModulos(UsuarioId));
    }
  }, [dispatch]);

  useEffect(() => {
    // Cerrar menú cuando cambia la ruta
    setIsOpen(false);
    setOpenMenus({});
  }, [location.pathname]);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (loading) {
    return (
      <Skeleton
        height="40px"
        width="40px"
        borderRadius="md"
        position="fixed"
        top="80px"
        left={4}
        zIndex={1100}
      />
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
    <>
      {/* Botón de menú hamburguesa flotante */}
      <IconButton
        icon={<FaBars />}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
        position="fixed"
        top="80px"
        left={4}
        size="md"
        bg={buttonBg}
        color="white"
        _hover={{ bg: buttonHoverBg }}
        borderRadius="md"
        shadow="lg"
        zIndex={1100}
      />

      {/* Overlay y panel del menú */}
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            backdropFilter="blur(4px)"
            onClick={() => setIsOpen(false)}
            zIndex={1200}
            animation={`${fadeIn} 0.3s ease`}
          />

          {/* Panel del menú */}
          <Box
            position="fixed"
            top={0}
            left={0}
            bottom={0}
            w="70%"
            maxW="280px"
            bg={menuBg}
            shadow="2xl"
            zIndex={1300}
            animation={`${slideIn} 0.3s ease`}
            overflowY="auto"
          >
            {/* Header del menú con botón cerrar */}
            <Box
              p={4}
              borderBottom="1px solid"
              borderColor={headerBorderColor}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box fontSize="lg" fontWeight="bold" color={menuTitleColor}>
                Menú Principal
              </Box>
              <IconButton
                icon={<CloseIcon />}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar menú"
                size="sm"
                variant="ghost"
                colorScheme="green"
                _hover={{ bg: closeButtonHoverBg }}
                borderRadius="full"
              />
            </Box>

            {/* Contenido del menú */}
            <VStack align="stretch" spacing={2} p={4}>
              {modulosAgrupados.map((modulo) => (
                <MenuItem
                  key={modulo.id}
                  item={modulo}
                  isExpanded={true}
                  toggleMenu={() => {}}
                  openMenus={openMenus}
                  setOpenMenus={setOpenMenus}
                  isMobileDrawer={true}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </VStack>
          </Box>
        </>
      )}
    </>
  );
};

export default MenuMobile;
