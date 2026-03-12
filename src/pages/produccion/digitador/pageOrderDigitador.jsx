import { Box } from "@chakra-ui/react";
import DigitadorOrdersPage from "./DigidaorOrdersPage";
import SEO from "../../../components/SEO";

export const PagePedidoDigitador = () => (
  <Box p={4} display="flex" justifyContent="center" alignItems="center">
    <SEO title="Producción - Digitador" description="Ingreso de órdenes de producción." />
    <DigitadorOrdersPage />
  </Box>
);

