import { Box } from "@chakra-ui/react";
import PedidosProduccionCardsPage from "./SupervisorOrdersPage";
import SEO from "../../../components/SEO";

export const SupervisorOrdersPage = () => (
  <Box p={4} display="flex" justifyContent="center" alignItems="center">
    <SEO title="Producción - Supervisor" description="Supervisión de producción." />
    <PedidosProduccionCardsPage />
  </Box>
);

export default SupervisorOrdersPage;
