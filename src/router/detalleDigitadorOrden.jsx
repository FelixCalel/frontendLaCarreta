import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageDetallePedidoDigitador } from "../pages/produccion/digitador/detalles/detalleOrderPage";

export const digitadorDetalleOrden = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="orden/:pedidoId"
          element={<PageDetallePedidoDigitador />}
        />{" "}
      </Route>
    </Routes>
  );
};
