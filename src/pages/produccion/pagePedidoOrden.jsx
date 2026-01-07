import { Box } from "@chakra-ui/react";
import ProductionOrdersPage from "./ProductionsOrdersPage";
import SEO from "../../components/SEO";

export const PagePedidoSuper = () => (
  <Box p={4} display="flex" justifyContent="center" alignItems="center">
    <SEO title="Producción - Mesa de Ayuda" description="Gestión de órdenes de producción." />
    <ProductionOrdersPage />
  </Box>
);

export default PagePedidoSuper;
