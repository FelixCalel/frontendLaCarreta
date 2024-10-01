import { Box } from "@chakra-ui/react";
import EntrantesPage from "./pageFormPedidosEntrantes";

export const PagePedidoEntrante = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <EntrantesPage />
    </Box>
  );
};

export default PagePedidoEntrante;
