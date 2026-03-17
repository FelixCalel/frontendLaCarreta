import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import SapHistorialDetallePage from "../pages/produccion/digitador/SapHistorialDetallePage";

export const historialSapRoute = () => (
  <Routes>
    <Route element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path=":pedidoId" element={<SapHistorialDetallePage />} />
    </Route>
  </Routes>
);
