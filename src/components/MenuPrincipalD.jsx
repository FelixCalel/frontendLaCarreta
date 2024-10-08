import { useState, useEffect } from 'react';
import { Box, Flex, IconButton, Text, VStack, Collapse, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModulos } from '../store/RolPermisoUsuario/thunks';  // Ajusta el path según corresponda
import { AiFillDashboard, AiOutlineShoppingCart, AiOutlineFileText } from 'react-icons/ai';
import { FaFileInvoice, FaCog, FaUsers } from 'react-icons/fa';

// Mapa de iconos
const iconMap = {
  AiFillDashboard: AiFillDashboard,
  AiOutlineShoppingCart: AiOutlineShoppingCart,
  AiOutlineFileText: AiOutlineFileText,
  FaFileInvoice: FaFileInvoice,
  FaCog: FaCog,
  FaUsers: FaUsers,
};

// Componente MenuItem
const MenuItem = ({ item, isExpanded, toggleMenu, indentLevel = 0, openMenus, setOpenMenus }) => {
  const isOpen = openMenus[item.nombre] || false;
  const hasChildren = item.opciones && item.opciones.length > 0;
  const linkBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const bgColorSecondary = useColorModeValue('gray.50', 'gray.600');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.300');

  const handleToggle = (e) => {
    if (!isExpanded) {
      toggleMenu();
    }
    if (hasChildren) {
      e.stopPropagation();
      setOpenMenus(prev => ({
        ...prev,
        [item.nombre]: !isOpen,
      }));
    }
  };

  return (
    <Flex direction="column" alignItems="start" ml={indentLevel * 4} width="100%">
      <Flex
        align="center"
        p="2"
        cursor="pointer"
        w="full"
        onClick={handleToggle}
        bg={isOpen ? (indentLevel === 0 ? linkBg : bgColorSecondary) : ''}
      >
        <Link
          to={item.ruta || "#"}
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flex: 1 }}
        >
          <Box as={item.icono} marginRight="8px" />
          {isExpanded && (
            <Text
              ml="2"
              color={indentLevel === 0 ? textColor : textColorSecondary}
              fontWeight={indentLevel === 0 ? 'medium' : 'normal'}
              fontSize={indentLevel === 0 ? 'md' : 'sm'}
            >
              {item.nombre}
            </Text>
          )}
        </Link>
        {hasChildren && (
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
        <Collapse in={isOpen} animateOpacity style={{ width: '100%' }}>
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const boxBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Obtener UsuarioId desde localStorage
    const UsuarioId = localStorage.getItem('usuarioId');
    console.log("UsuarioId obtenido del localStorage:", UsuarioId);

    // Solo hacemos la solicitud si el UsuarioId está presente
    if (UsuarioId) {
      dispatch(fetchModulos(UsuarioId)).then((response) => {
        console.log("Datos obtenidos:", response); // Verifica los datos aquí
      });
    } else {
      console.error("UsuarioId no disponible en localStorage");
    }
  }, [dispatch]);
  
  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setOpenMenus({});
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const modulosAgrupados = agruparModulos(modulos);

  if (modulosAgrupados.length === 0 && !loading) {
    return <div>No hay módulos disponibles.</div>;
  }

  return (
    <Box
      w={isExpanded ? "220px" : "70px"}
      bg={boxBg}
      transition="width 0.5s"
      p={4}
      boxShadow="base"
      borderRight={`1px solid ${borderColor}`}
    >
      <IconButton
        icon={<HamburgerIcon />}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        isRound
        variant="ghost"
      />
      <VStack align="stretch" spacing={1}>
        {modulosAgrupados.map((modulo) => (
          <MenuItem
            key={modulo.id}
            item={{
              nombre: modulo.nombre,
              ruta: modulo.ruta,
              icono: modulo.icono,
              opciones: modulo.opciones,
            }}
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
