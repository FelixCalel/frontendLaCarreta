import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PagePedidoDigitador } from "../pages/produccion/digitador/pageOrderDigitador";

export const digitadorOrden = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orden/pedido" element={<PagePedidoDigitador />} />{" "}
      </Route>
    </Routes>
  );
};
