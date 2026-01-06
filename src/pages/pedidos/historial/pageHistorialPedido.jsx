import { Box } from "@chakra-ui/react";
import HistorialPedido from "./pageFormHistorialPedido"; // Importación correcta de la exportación por defecto
import SEO from "../../../components/SEO";

export const PageHistorialPedido = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      <SEO title="Historial de Pedidos" description="Registro histórico de todos los pedidos." />
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <HistorialPedido /> {/* Uso correcto del componente con letra mayúscula */}
    </Box>
  );
};

export default PageHistorialPedido;
