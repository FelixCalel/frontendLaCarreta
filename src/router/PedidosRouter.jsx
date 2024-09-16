import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import PageDetallePedido from "../pages/pedidos/pagePedido"; // Asegúrate de tener este componente de página para pedidos

export const PaginaPedido = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pedidos" element={<PageDetallePedido />} /> 
        {/* Más rutas anidadas si es necesario */}
      </Route>
    </Routes>
  );
}
