import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageFabricacionPedidoDigitador } from "../pages/produccion/digitador/FabricacionDetailsPage";

export const fabricacionDetailOrder = () => (
  <Routes>
    <Route element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path=":pedidoId" element={<PageFabricacionPedidoDigitador />} />
    </Route>
  </Routes>
);
