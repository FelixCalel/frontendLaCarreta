import { Box } from "@chakra-ui/react";
import PageFormPedidos from "./pageFormPedidos"; // Importación correcta de la exportación por defecto

export const PageDetallePedido = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <PageFormPedidos /> {/* Uso correcto del componente con letra mayúscula */}
    </Box>
  );
};

export default PageDetallePedido;
