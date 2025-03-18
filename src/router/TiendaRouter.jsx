import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageTienda } from "../pages/tienda/pageTienda"

export const PaginaTienda = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        
        <Route path="listar" element={<PageTienda />} />  {/* Cambiamos la ruta a Tienda */}
        {/* Más rutas anidadas si es necesario */}
      </Route>
    </Routes>
  );
}
