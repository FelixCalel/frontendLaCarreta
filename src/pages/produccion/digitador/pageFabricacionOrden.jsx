import { Box } from "@chakra-ui/react";
import DigitadorFabricacionOrdersPage from "./DigitadorFabricacionOrderPage";
import SEO from "../../../components/SEO";

export const PageFabricacionPedidoDigitador = () => (
  <Box p={4} display="flex" justifyContent="center" alignItems="center">
    <SEO title="Producción - Fabricación" description="Órdenes de fabricación." />
    <DigitadorFabricacionOrdersPage />
  </Box>
);

