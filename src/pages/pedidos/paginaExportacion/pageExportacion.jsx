import { Box } from "@chakra-ui/react";
import AprobadosPage from "./pageFormExportacion";

export const PagePedidoAprobados = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <AprobadosPage />
    </Box>
  );
};

export default PagePedidoAprobados;
