import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import MenuPrincipalD from "../../components/MenuPrincipalD";
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FaUserShield,
  FaUserAlt,
  FaShoppingCart,
  FaBox,
  FaSearch,
} from "react-icons/fa";

// Mapeo de ID de rol => nombre legible
const roleMap = {
  1: "Administrador",
  2: "Usuario",
  3: "Ventas",
  4: "Compras",
  5: "QA",
};

// Mapeo de nombre de rol => colorScheme
// Se usan tonos más suaves
const roleColorMap = {
  Administrador: "red",
  Usuario: "blue",
  Ventas: "green",
  Compras: "orange",
  QA: "purple",
};

// Mapeo de nombre de rol => icono (opcional)
const roleIconMap = {
  Administrador: FaUserShield,
  Usuario: FaUserAlt,
  Ventas: FaShoppingCart,
  Compras: FaBox,
  QA: FaSearch,
};

const HomePage = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolNombre, setRolNombre] = useState("");

  useEffect(() => {
    const nombre = localStorage.getItem("nombreUsuario");
    const roleId = localStorage.getItem("roleId");

    if (nombre) {
      setNombreUsuario(nombre);
    }
    if (roleId && roleMap[roleId]) {
      setRolNombre(roleMap[roleId]);
    } else {
      setRolNombre("Sin rol");
    }
  }, []);

  // Colores adaptables
  const pageBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const contentBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Determina colorScheme según el nombre del rol
  const badgeColorScheme = roleColorMap[rolNombre] || "gray";
  // Determina el icono según el nombre del rol
  const RoleIcon = roleIconMap[rolNombre];

  return (
    <Flex minH="100vh" direction="column" bg={pageBg} color={textColor}>
      {/* Navbar */}
      <NavBar />

      <Flex flex="1" direction="row">
        <MenuPrincipalD />

        {/* Contenido principal */}
        <Box flex="1" p={4} bg={contentBg}>
          {/* Sección de bienvenida transparente */}
          <Box
            bg="transparent"
            color={textColor}
            p={8}
            borderRadius="md"
            mb={6}
            boxShadow="md"
            border="1px solid"
            borderColor={borderColor}
          >
            <Heading as="h1" size="xl">
              Bienvenido, {nombreUsuario}
              {rolNombre && rolNombre !== "Sin rol" && (
                <Badge
                  ml={3}
                  variant="subtle"
                  colorScheme={badgeColorScheme}
                  fontSize="xs" // <--- aún más pequeño que 0.75em
                  lineHeight="1" // <--- reduce el alto de línea
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                >
                  {/* Icono más pequeño */}
                  {RoleIcon && <Icon as={RoleIcon} boxSize={3} />}
                  {rolNombre}
                </Badge>
              )}
            </Heading>
            <Text fontSize="md" mt={2}>
              ¡Nos alegra tenerte de vuelta! Explora el menú lateral para
              acceder a las secciones disponibles.
            </Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;
