import { Box } from "@chakra-ui/react";
import HistorialPedido from "./pageFormHistorialPedido";
import SEO from "../../../components/SEO";

export const PageHistorialPedido = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      <SEO
        title="Historial de Pedidos"
        description="Registro histórico de todos los pedidos."
      />
      <HistorialPedido />
    </Box>
  );
};

