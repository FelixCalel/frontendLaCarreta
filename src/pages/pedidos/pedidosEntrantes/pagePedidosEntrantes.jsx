import { Box } from "@chakra-ui/react";
import EntrantesPage from "./pageFormPedidosEntrantes";
import SEO from "../../../components/SEO";

export const PagePedidoEntrante = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      <SEO title="Pedidos Entrantes" description="Gestión de nuevos pedidos entrantes." />
      {/* Aquí puedes ajustar el componente principal del formulario */}
      <EntrantesPage />
    </Box>
  );
};

export default PagePedidoEntrante;
