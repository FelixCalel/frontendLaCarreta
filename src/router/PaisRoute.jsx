import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { PagePerfil,Dashboard } from "../pages";
import PagePais from "../pages/pais/pagePais";

 
export const PaginaPais = () => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Dashboard />} > */}
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        
        <Route path="listar" element={<PagePais />} /> 
        <Route path="perfil" element={<PagePerfil />} />
        {/* Más rutas anidadas si es necesario */}
      </Route>
      {/* </Route>  */}
    </Routes>
  );
}