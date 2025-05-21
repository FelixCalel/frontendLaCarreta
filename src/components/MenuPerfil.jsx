import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Text,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  FaUser,
  FaUsers,
  FaKey,
  FaShieldAlt,
  FaSignOutAlt,
  FaBoxes,
  FaThList,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth";
import { useEffect, useState } from "react";

export const MenuPerfil = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    const nombre = localStorage.getItem("nombreUsuario");
    const correo = localStorage.getItem("correoUsuario");

    if (nombre && correo) {
      setNombreUsuario(nombre);
      setCorreoUsuario(correo);
    }
  }, []);

  const onLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  const menuBgColor = useColorModeValue("white", "gray.800");
  const menuHeaderBg = useColorModeValue("teal.500", "teal.600");
  const avatarBg = useColorModeValue("gray.300", "gray.600");
  const menuItemHoverBg = useColorModeValue("green.100", "green.700");
  const menuItemFocusBg = useColorModeValue("green.200", "green.800");
  const logoutHoverBg = useColorModeValue("red.500", "red.600");
  const iconColor = useColorModeValue("gray.600", "white");

  return (
    <Box className="TestingBox">
      <Flex h={16} alignItems="center" justifyContent="flex-end">
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label="Perfil"
            icon={<FaUser />}
            variant="ghost"
            size="lg"
            color={iconColor}
            // Hover/active del botón de perfil
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            _active={{ bg: useColorModeValue("gray.200", "gray.600") }}
          />

          <MenuList
            bg={menuBgColor}
            borderRadius="md"
            boxShadow="xl"
            p={0}
            minW="240px"
          >
            {/* Encabezado del menú */}
            <Flex
              direction="column"
              alignItems="center"
              p={4}
              bg={menuHeaderBg}
            >
              <Avatar size="lg" name={nombreUsuario} bg={avatarBg} mb={2} />
              <Text fontWeight="bold" color="white">
                {nombreUsuario || "Nombre Usuario"}
              </Text>
              <Text fontSize="sm" color="whiteAlpha.800">
                {correoUsuario || "usuario@correo.com"}
              </Text>
            </Flex>

            {/* Ítems del menú */}
            <MenuItem
              as={Link}
              to="/admin/perfil"
              icon={<FaUser />}
              _hover={{ bg: menuItemHoverBg, color: "white" }}
              _focus={{ bg: menuItemFocusBg, color: "white" }}
              py={2}
            >
              Perfil
            </MenuItem>

            {/* Solo para roles 1 y 3 */}
            {["1", "3"].includes(roleId) && (
              <MenuItem
                as={Link}
                to="/admin/usuarios"
                icon={<FaUsers />}
                _hover={{ bg: menuItemHoverBg, color: "white" }}
                _focus={{ bg: menuItemFocusBg, color: "white" }}
              >
                Usuarios
              </MenuItem>
            )}

            {/* Solo para rol 1 (Admin) */}
            {roleId === "1" && (
              <>
                <MenuItem
                  as={Link}
                  to="/admin/roles"
                  icon={<FaKey />}
                  _hover={{ bg: menuItemHoverBg, color: "white" }}
                  _focus={{ bg: menuItemFocusBg, color: "white" }}
                >
                  Roles
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/admin/permisos"
                  icon={<FaShieldAlt />}
                  _hover={{ bg: menuItemHoverBg, color: "white" }}
                  _focus={{ bg: menuItemFocusBg, color: "white" }}
                >
                  Permisos
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/admin/modulos"
                  icon={<FaBoxes />}
                  _hover={{ bg: menuItemHoverBg, color: "white" }}
                  _focus={{ bg: menuItemFocusBg, color: "white" }}
                >
                  Módulos
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/admin/opciones"
                  icon={<FaThList />}
                  _hover={{ bg: menuItemHoverBg, color: "white" }}
                  _focus={{ bg: menuItemFocusBg, color: "white" }}
                >
                  Opciones
                </MenuItem>
              </>
            )}

            <Divider my={1} />

            <MenuItem
              icon={<FaSignOutAlt />}
              _hover={{ bg: logoutHoverBg, color: "white" }}
              onClick={onLogout}
            >
              Cerrar sesión
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};
