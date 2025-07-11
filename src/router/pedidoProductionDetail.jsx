import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import SupervisorPageDetail from "../pages/produccion/supervisor/pageSupervisorDetail";

export const productionOrdenDetails = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orden/:pedidoId" element={<SupervisorPageDetail />} />
      </Route>
    </Routes>
  );
};
