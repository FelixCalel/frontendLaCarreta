import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageDeu } from "../pages/deus/pageDeus"

export const PaginaDeu = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="listar" element={<PageDeu />} />  {/* Cambiamos la ruta a Deu */}
        {/* Más rutas anidadas si es necesario */}
      </Route>
    </Routes>
  );
}
