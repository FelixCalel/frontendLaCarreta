import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageDetallePedido } from "../pages/produccion/pagePedidoOrden";

export const produccionOrden = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orden" element={<PageDetallePedido />} />{" "}
        {/* Cambiamos la ruta a Item */}
        {/* Más rutas anidadas si es necesario */}
      </Route>
    </Routes>
  );
};
