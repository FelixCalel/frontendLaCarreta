import { Routes, Route } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import PageAsignacion from "../pages/asignarAreaMesa/pageAsignacion";
import PageAsignacionAreas from "../pages/asignarAreaMesa/PageAsignacionAreas";

export const PaginaAsignacionAM = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<PageAsignacionAreas />} />
        <Route path=":id" element={<PageAsignacion />} />
      </Route>
    </Routes>
  );
};
