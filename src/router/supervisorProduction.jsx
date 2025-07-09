import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { SupervisorOrdersPage } from "../pages/produccion/supervisor/pageSupervisor";

export const produccionOrdenSuper = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orden" element={<SupervisorOrdersPage />} />{" "}
        {/* Cambiamos la ruta a Item */}
        {/* Más rutas anidadas si es necesario */}
      </Route>
    </Routes>
  );
};
