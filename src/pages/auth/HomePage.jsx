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
} from "@chakra-ui/react";

const roleMap = {
  1: "Administrador",
  2: "Usuario",
  3: "Ventas",
  4: "Compras",
  5: "QA",
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

  const bg = useColorModeValue("gray.50", "gray.800");
  const color = useColorModeValue("gray.800", "white");
  const boxBg = useColorModeValue("white", "gray.900");

  return (
    <Flex height="100vh" direction="column" bg={bg} color={color}>
      <NavBar />

      <Flex flex="1" direction="row" minHeight="100vh">
        <MenuPrincipalD />

        <Box flex="1" p={4} m={0} bg={boxBg}>
          <Box
            bgGradient="linear(to-r, teal.500, green.500)"
            color="white"
            p={8}
            borderRadius="md"
            mb={6}
          >
            <Heading as="h1" size="xl">
              Bienvenido, {nombreUsuario}
              {rolNombre && (
                <Badge ml={4} variant="solid" colorScheme="blackAlpha">
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
