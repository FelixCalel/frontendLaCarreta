import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import SupervisorOrdersPage from "../pages/produccion/supervisor/SupervisorOrdersPage";

export const produccionOrdenSuper = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orden" element={<SupervisorOrdersPage />} />
        <Route path="orden/:pedidoId" element={<SupervisorOrdersPage />} />{" "}
      </Route>
    </Routes>
  );
};
