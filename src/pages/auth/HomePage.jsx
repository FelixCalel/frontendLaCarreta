import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import MenuPrincipalD from "../../components/MenuPrincipalD";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

const HomePage = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const nombre = localStorage.getItem("nombreUsuario");
    if (nombre) {
      setNombreUsuario(nombre);
    }
  }, []);

  // Define colores que cambiarán según el modo
  const bg = useColorModeValue("gray.50", "gray.800");
  const color = useColorModeValue("gray.800", "white");
  const boxBg = useColorModeValue("white", "gray.900");
  const textSecondary = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex height="100vh" direction="column" bg={bg} color={color}>
      {/* NavBar */}
      <NavBar />

      {/* Contenido principal */}
      <Flex flex="1" direction="row" minHeight="100vh">
        {/* Sidebar */}
        <MenuPrincipalD />

        {/* Sección principal */}
        <Box flex="1" p={4} m={0} bg={boxBg}>
          <Heading as="h1" size="xl" mb={4} textAlign="left">
            Bienvenido {nombreUsuario}
          </Heading>
          <Text fontSize="lg" color={textSecondary} mb={6}>
            ¡Nos alegra tenerte de vuelta! Aquí podrás acceder a los distintos
            servicios.
          </Text>

          <Stack direction="column" mt={6} spacing={3} align="flex-start">
            {/* Aquí podrías añadir botones u otros elementos */}
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;
