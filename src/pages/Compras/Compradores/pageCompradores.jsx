import { Box } from "@chakra-ui/react";
import CompradoresPage from "./pageFormCompradores";
import SEO from "../../../components/SEO";

const CompradorPage = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      <SEO title="Gestión de Compradores" description="Administración de compradores." />
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <CompradoresPage />
    </Box>
  );
};

export default CompradoresPage;
