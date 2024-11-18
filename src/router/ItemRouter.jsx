import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageItems } from "../pages/Items/pageItems"

export const PaginaItem = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="listar" element={<PageItems />} />  {/* Cambiamos la ruta a Item */}
        {/* Más rutas anidadas si es necesario */}
      </Route>
    </Routes>
  );
}
