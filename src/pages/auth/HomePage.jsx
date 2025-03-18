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
  FaUserTie,
} from "react-icons/fa";

const roleMap = {
  1: "Administrador",
  2: "Usuario",
  3: "Ventas",
  5: "Compras",
  6: "QA",
  7: "Supervisor",
};

const roleColorMap = {
  Administrador: "red",
  Usuario: "blue",
  Ventas: "green",
  Supervisor: "pink",
  Compras: "orange",
  QA: "purple",
};

const roleIconMap = {
  Administrador: FaUserShield,
  Usuario: FaUserAlt,
  Ventas: FaShoppingCart,
  Supervisor: FaUserTie,
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

  const pageBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const contentBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const badgeColorScheme = roleColorMap[rolNombre] || "gray";
  const RoleIcon = roleIconMap[rolNombre];

  return (
    <Flex minH="100vh" direction="column" bg={pageBg} color={textColor}>
      <NavBar />

      <Flex flex="1" direction="row">
        <MenuPrincipalD />

        <Box flex="1" p={4} bg={contentBg}>
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
                  fontSize="xs"
                  lineHeight="1"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                >
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
