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
  FaBoxes, // Icono para Módulos
  FaThList
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

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("green.500", "white");
  const focusBg = useColorModeValue("green.500", "white");

  return (
    <Box>
      <Flex h={16} alignItems={"center"} justifyContent={"flex-end"}>
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label="Perfil"
            icon={<FaUser />}
            variant="ghost"
            _hover={{ bg: useColorModeValue("green.100", "gray.700") }}
            _active={{ bg: useColorModeValue("green.200", "gray.600") }}
            size="lg"
            color={useColorModeValue("gray.600", "white")}
          />
          <MenuList
            bg={bgColor}
            borderRadius="md"
            boxShadow="xl"
            p={0}
            minW="240px"
          >
            <Flex direction="column" alignItems="center" p={4} bg="teal.500">
              <Avatar
                size="lg"
                name={nombreUsuario}
                bg={useColorModeValue("gray.300", "gray.600")}
                mb={2}
              />
              <Text fontWeight="bold" color="white">
                {nombreUsuario || "Nombre Usuario"}
              </Text>
              <Text fontSize="sm" color="whiteAlpha.800">
                {correoUsuario || "usuario@correo.com"}
              </Text>
            </Flex>

            {/* Opciones del menú de perfil */}
            <MenuItem
              as={Link}
              to="/admin/perfil"
              icon={<FaUser />}
              _hover={{ bg: hoverBg, color: "white" }}
              _focus={{ bg: focusBg, color: "white" }}
              py={2}
            >
              Perfil
            </MenuItem>

            {roleId === "1" && (
              <>
                {/* Opciones de administración */}
                <MenuItem
                  as={Link}
                  to="/admin/usuarios"
                  icon={<FaUsers />}
                  _hover={{ bg: hoverBg, color: "white" }}
                >
                  Usuarios
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/admin/listarRoles"
                  icon={<FaKey />}
                  _hover={{ bg: hoverBg, color: "white" }}
                >
                  Roles
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/admin/permisos"
                  icon={<FaShieldAlt />}
                  _hover={{ bg: hoverBg, color: "white" }}
                >
                  Permisos
                </MenuItem>
                {/* Nueva opción para Módulos */}
                <MenuItem
                  as={Link}
                  to="/admin/listarModulos"
                  icon={<FaBoxes />}
                  _hover={{ bg: hoverBg, color: "white" }}
                >
                  Módulos
                </MenuItem>
                {/* Nueva opción para Opciones */}
                <MenuItem
                  as={Link}
                  to="/admin/listarOpciones"
                  icon={<FaThList />}
                  _hover={{ bg: hoverBg, color: "white" }}
                >
                  Opciones
                </MenuItem>
              </>
            )}

            <Divider my={1} />

            <MenuItem
              icon={<FaSignOutAlt />}
              _hover={{ bg: "red.500", color: "white" }}
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
