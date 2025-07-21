import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageFabricacionPedidoDigitador } from "../pages/produccion/digitador/pageFabricacionOrden";

export const digitadorFabricacionOrden = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orden" element={<PageFabricacionPedidoDigitador />} />{" "}
      </Route>
    </Routes>
  );
};
