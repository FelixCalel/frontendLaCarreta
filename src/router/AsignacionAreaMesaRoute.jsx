import { Routes, Route } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import PageAsignacion from "../pages/asignarAreaMesa/pageAsignacion";

export const PaginaAsignacionAM = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<PageAsignacion />} />
      </Route>
    </Routes>
  );
};
