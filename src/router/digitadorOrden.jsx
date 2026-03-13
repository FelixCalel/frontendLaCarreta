import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PagePedidoDigitador } from "../pages/produccion/digitador/pageOrderDigitador";
import SapHistorialDetallePage from "../pages/produccion/digitador/SapHistorialDetallePage";

export const digitadorOrden = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orden/pedido" element={<PagePedidoDigitador />} />
        <Route
          path="orden/pedido/historial/:pedidoId"
          element={<SapHistorialDetallePage />}
        />
      </Route>
    </Routes>
  );
};
