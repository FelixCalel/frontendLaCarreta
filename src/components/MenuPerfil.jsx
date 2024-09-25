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
  FaBuilding,
  FaUsers,
  FaKey,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa"; // Iconos adicionales
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth";
import { useEffect, useState } from "react";

export const MenuPerfil = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Estados para almacenar el nombre y correo del usuario
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");

  // Recuperar los datos del usuario desde localStorage cuando el componente se monta
  useEffect(() => {
    const nombre = localStorage.getItem("nombreUsuario");
    const correo = localStorage.getItem("correoUsuario");

    if (nombre && correo) {
      setNombreUsuario(nombre);
      setCorreoUsuario(correo);
    }
  }, []);

  const onLogout = () => {
    // Limpiar el localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("correoUsuario");

    // Despachar la acción logout
    dispatch(logout());

    // Redirigir al usuario a la página de login
    navigate("/auth/login", {
      replace: true, // Remplaza la ruta actual en el historial de navegación
    });
  };

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
            bg={useColorModeValue("white", "gray.800")}
            borderRadius="md"
            boxShadow="xl"
            p={0}
            minW="240px"
          >
            {/* Avatar y nombre de usuario */}
            <Flex direction="column" alignItems="center" p={4} bg="teal.500">
              <Avatar
                size="lg"
                name={nombreUsuario} // Muestra el nombre real del usuario
                bg={useColorModeValue("gray.300", "gray.600")}
                icon={<FaUser size={40} />}
                mb={2}
              />
              <Text fontWeight="bold" color="white">
                {nombreUsuario || "Nombre Usuario"} {/* Si no hay nombre, muestra un placeholder */}
              </Text>
              <Text fontSize="sm" color="whiteAlpha.800">
                {correoUsuario || "usuario@correo.com"} {/* Si no hay correo, muestra un placeholder */}
              </Text>
            </Flex>

            {/* Opciones del menú */}
            <MenuItem
              as={Link}
              to="/admin/perfil"
              icon={<FaUser />}
              _hover={{ bg: "green.500", color: "white" }}
              _focus={{ bg: "green.500", color: "white" }}
              py={2}
            >
              Perfil
            </MenuItem>

            <MenuItem
              as={Link}
              to="/admin/empresas"
              icon={<FaBuilding />}
              _hover={{ bg: "green.500", color: "white" }}
              _focus={{ bg: "green.500", color: "white" }}
              py={2}
            >
              Empresas
            </MenuItem>

            <MenuItem
              as={Link}
              to="/admin/usuarios"
              icon={<FaUsers />}
              _hover={{ bg: "green.500", color: "white" }}
              _focus={{ bg: "green.500", color: "white" }}
              py={2}
            >
              Usuarios
            </MenuItem>

            <MenuItem
              as={Link}
              to="/admin/roles"
              icon={<FaKey />}
              _hover={{ bg: "green.500", color: "white" }}
              _focus={{ bg: "green.500", color: "white" }}
              py={2}
            >
              Roles
            </MenuItem>

            <MenuItem
              as={Link}
              to="/admin/permisos"
              icon={<FaShieldAlt />}
              _hover={{ bg: "green.500", color: "white" }}
              _focus={{ bg: "green.500", color: "white" }}
              py={2}
            >
              Permisos
            </MenuItem>

            <Divider my={1} />

            {/* Opción de cerrar sesión */}
            <MenuItem
              icon={<FaSignOutAlt />}
              _hover={{ bg: "red.500", color: "white" }}
              _focus={{ bg: "red.500", color: "white" }}
              py={2}
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
