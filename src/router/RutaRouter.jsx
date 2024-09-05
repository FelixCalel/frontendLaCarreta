import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import { PageRuta } from "../pages/Ruta/pageRuta"
 
export const PaginaRuta = () => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Dashboard />} > */}
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        
        <Route path="listar" element={<PageRuta />} /> 
        {/* Más rutas anidadas si es necesario */}
      </Route>
      {/* </Route>  */}
    </Routes>
  );
}