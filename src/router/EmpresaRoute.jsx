import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageEmpresa } from "../pages/empresa/pageEmpresa";
 
export const PaginaEmpresa = () => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Dashboard />} > */}
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        
        <Route path="listar" element={<PageEmpresa />} /> 
        {/* Más rutas anidadas si es necesario */}
      </Route>
      {/* </Route>  */}
    </Routes>
  );
}