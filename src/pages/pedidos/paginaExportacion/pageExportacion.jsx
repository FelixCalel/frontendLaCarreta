import { Box } from "@chakra-ui/react";
import AprobadosPage from "./pageFormExportacion";
import SEO from "../../../components/SEO";

export const PagePedidoAprobados = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      <SEO title="Exportación de Pedidos" description="Módulo para exportar pedidos aprobados." />
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <AprobadosPage />
    </Box>
  );
};

export default PagePedidoAprobados;
