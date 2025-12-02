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
import { useDispatch, useSelector } from "react-redux";
import { startLogout } from "../store/auth/thunks";

export const MenuPerfil = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { displayName, photoURL, correo } = useSelector((state) => state.auth);
  const roleId = localStorage.getItem("roleId");

  const userData = {
    nombre: displayName || localStorage.getItem("nombreUsuario") || "Usuario",
    correo: correo || localStorage.getItem("correoUsuario") || "",
    avatar: photoURL || localStorage.getItem("avatar") || "",
  };

  const onLogout = () => {
    dispatch(startLogout());
    navigate("/auth/login", { replace: true });
  };

  const menuBgColor = useColorModeValue("white", "gray.800");
  const menuHeaderBg = useColorModeValue("brand.500", "brand.600");
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
            icon={
              <Avatar
                size="sm"
                name={userData.nombre}
                src={userData.avatar}
                bg={avatarBg}
              />
            }
            variant="ghost"
            size="lg"
            color={iconColor}
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
              <Avatar
                size="lg"
                name={userData.nombre}
                src={userData.avatar}
                bg={avatarBg}
                mb={2}
                border="2px solid white"
              />
              <Text fontWeight="bold" color="white">
                {userData.nombre || "Nombre Usuario"}
              </Text>
              <Text fontSize="sm" color="whiteAlpha.800">
                {userData.correo || "usuario@correo.com"}
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
                  to="/admin/listarRoles"
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
                  to="/admin/Modulos/listarModulos"
                  icon={<FaBoxes />}
                  _hover={{ bg: menuItemHoverBg, color: "white" }}
                  _focus={{ bg: menuItemFocusBg, color: "white" }}
                >
                  Módulos
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/admin/listarOpciones"
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
