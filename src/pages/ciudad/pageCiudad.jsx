import { Box } from "@chakra-ui/react";
import TablaCiudad from "./pageFormCiudad";
import SEO from "../../components/SEO";

export const PageCiudad = () => {
  return (
    <>
      <SEO title="Gestión de Ciudades" description="Catálogo de ciudades y zonas comerciales." />
      <Box p={6}>
        <TablaCiudad />
      </Box>
    </>
  );
};

