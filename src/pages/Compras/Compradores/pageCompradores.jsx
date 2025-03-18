import { Box } from "@chakra-ui/react";
import CompradoresPage from "./pageFormCompradores";

export const CompradorPage = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <CompradoresPage />
    </Box>
  );
};

export default CompradoresPage;
