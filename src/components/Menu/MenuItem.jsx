import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Flex,
  Text,
  VStack,
  Collapse,
  useColorModeValue,
  Tooltip,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";

const MenuItem = ({
  item,
  isExpanded,
  toggleMenu,
  indentLevel = 0,
  openMenus,
  setOpenMenus,
  isMobileDrawer = false,
  onNavigate,
}) => {
  const isOpen = openMenus[item.nombre] || false;
  const hasChildren = item.opciones && item.opciones.length > 0;

  // Colores VERDES similares a los botones y footer
  const linkBgHover = useColorModeValue("green.50", "green.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const textColorSecondary = useColorModeValue("gray.600", "gray.400");
  const activeBg = useColorModeValue("green.500", "green.600");
  const activeTextColor = useColorModeValue("white", "white");
  const iconColor = useColorModeValue("green.600", "green.300");
  const childBorderColor = useColorModeValue("green.200", "green.700");
  const tooltipBg = useColorModeValue("gray.700", "gray.300");
  const tooltipColor = useColorModeValue("white", "gray.800");

  const location = useLocation();
  const isActive = item.ruta ? location.pathname === item.ruta : false;

  const handleToggle = (e) => {
    if (!isExpanded && !isMobileDrawer) {
      toggleMenu();
    }
    if (hasChildren) {
      e.preventDefault();
      e.stopPropagation();
      setOpenMenus((prev) => ({
        ...prev,
        [item.nombre]: !isOpen,
      }));
    } else if (item.ruta && onNavigate) {
      // Si no tiene hijos y hay ruta, cerrar el menú móvil al navegar
      onNavigate();
    }
  };

  useEffect(() => {
    if (hasChildren) {
      const childActive = item.opciones?.some(
        (sub) => location.pathname === sub.ruta
      );
      if (childActive && !isOpen) {
        setOpenMenus((prev) => ({
          ...prev,
          [item.nombre]: true,
        }));
      }
    }
  }, [
    location.pathname,
    hasChildren,
    item.opciones,
    item.nombre,
    isOpen,
    setOpenMenus,
  ]);

  const menuContent = (
    <Flex
      direction="column"
      alignItems="start"
      ml={isExpanded || isMobileDrawer ? indentLevel * 4 : 0}
      width="100%"
      mb={1}
    >
      <Flex
        as={Link}
        to={item.ruta || "#"}
        align="center"
        p={3}
        cursor="pointer"
        w="full"
        onClick={handleToggle}
        bg={isActive ? activeBg : "transparent"}
        color={
          isActive
            ? activeTextColor
            : indentLevel === 0
            ? textColor
            : textColorSecondary
        }
        borderRadius="lg"
        _hover={{
          bg: isActive ? activeBg : linkBgHover,
          transform: "translateX(4px)",
          boxShadow: "md",
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        position="relative"
        overflow="hidden"
        fontWeight={
          isActive ? "semibold" : indentLevel === 0 ? "medium" : "normal"
        }
        fontSize={indentLevel === 0 ? "md" : "sm"}
        textDecoration="none"
        _before={{
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: isActive ? "4px" : "0px",
          bg: "green.600",
          transition: "width 0.3s ease",
        }}
      >
        {item.icono && (
          <Icon
            as={item.icono}
            boxSize={indentLevel === 0 ? 5 : 4}
            mr={isExpanded || isMobileDrawer ? 3 : 0}
            color={isActive ? activeTextColor : iconColor}
            transition="all 0.3s ease"
          />
        )}

        {(isExpanded || isMobileDrawer) && (
          <Flex align="center" flex={1} justify="space-between">
            <Text isTruncated transition="all 0.3s ease">
              {item.nombre}
            </Text>

            {hasChildren && (
              <Icon
                as={isOpen ? ChevronDownIcon : ChevronRightIcon}
                boxSize={4}
                ml={2}
                transition="transform 0.3s ease"
              />
            )}

            {hasChildren && !isOpen && (
              <Badge
                ml={2}
                colorScheme="green"
                borderRadius="full"
                fontSize="xs"
                px={2}
              >
                {item.opciones.length}
              </Badge>
            )}
          </Flex>
        )}
      </Flex>

      {hasChildren && (
        <Collapse in={isOpen} animateOpacity>
          <Box
            pl={isExpanded || isMobileDrawer ? 2 : 0}
            pt={2}
            pb={1}
            w="full"
            borderLeft={isExpanded || isMobileDrawer ? "2px solid" : "none"}
            borderColor={childBorderColor}
            ml={isExpanded || isMobileDrawer ? 4 : 0}
          >
            <VStack spacing={1} align="stretch">
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
                  isMobileDrawer={isMobileDrawer}
                  onNavigate={onNavigate}
                />
              ))}
            </VStack>
          </Box>
        </Collapse>
      )}
    </Flex>
  );

  // Si no está expandido y no es mobile drawer, mostrar tooltip
  if (!isExpanded && !isMobileDrawer && indentLevel === 0) {
    return (
      <Tooltip
        label={item.nombre}
        placement="right"
        hasArrow
        bg={tooltipBg}
        color={tooltipColor}
        fontSize="sm"
        px={3}
        py={2}
        borderRadius="md"
      >
        {menuContent}
      </Tooltip>
    );
  }

  return menuContent;
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
  isMobileDrawer: PropTypes.bool,
  onNavigate: PropTypes.func,
};

export default MenuItem;
