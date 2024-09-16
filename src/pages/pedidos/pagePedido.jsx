import { Box } from "@chakra-ui/react";
import DetallePedidoForm from "./pageFormPedidos";

export const PageDetallePedido = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <DetallePedidoForm />
    </Box>
  );
};

export default PageDetallePedido;
