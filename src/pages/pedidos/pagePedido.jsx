import { Box } from "@chakra-ui/react";
import DetallePedidoForm from "./pageFormPedidos"; // Importación correcta de la exportación por defecto

export const PageDetallePedido = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <DetallePedidoForm /> {/* Uso correcto del componente con letra mayúscula */}
    </Box>
  );
};

export default DetallePedidoForm;
