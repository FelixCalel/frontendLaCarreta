import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PagePedidoSuper } from "../pages/produccion/pagePedidoOrden";
import SupervisorPageDetail from "../pages/produccion/supervisor/pageSupervisorDetail";

export const produccionOrden = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="produccion" element={<PagePedidoSuper />} />{" "}
        <Route path="produccion/:pedidoId" element={<SupervisorPageDetail />} />
      </Route>
    </Routes>
  );
};
