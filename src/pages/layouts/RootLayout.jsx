import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { Grid, Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { MenuPrincipal } from "../../components/MenuPrincipal";
import Footer from "../../pages/proveedores/Footer";
import { NavBarDashboard } from "../../components/NavBarDashboard";
import { useEffect, useState } from "react";

export const RootLayout = () => {
  const [, setNombresUsuario] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("userData"));
    if (usuario) {
      setNombresUsuario(usuario["displayName"]);
    }
  }, []);

  const headerBg = useColorModeValue("white", "gray.900");
  const headerColor = useColorModeValue("black", "white");
  const contentBg = useColorModeValue("white", "gray.800");

  return (
    <Grid
      minH="100vh"
      templateRows="auto 1fr auto"
      templateColumns="repeat(5, 1fr)"
    >
      <Box gridRow="1" gridColumn="1 / -1" bg={headerBg} color={headerColor}>
        <NavBar />
      </Box>

      <Flex gridRow="2" gridColumn="1 / -1" overflow="hidden">
        <MenuPrincipal />
        <Flex
          flex="1"
          bg={contentBg}
          direction="column"
          minW={0}
          overflow="hidden"
        >
          <NavBarDashboard />
          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            overflowY="auto"
            overflowX="hidden"
          >
            <Outlet />
          </Box>
        </Flex>
      </Flex>

      <Box gridRow="3" gridColumn="1 / -1">
        <Footer />
      </Box>
    </Grid>
  );
};
