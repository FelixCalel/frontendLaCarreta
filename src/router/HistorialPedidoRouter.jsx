import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import PageHistorialPedido from "../pages/pedidos/historial/pageHistorialPedido";

 
export const PaginaHistorialPedido = () => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Dashboard />} > */}
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        
        <Route path="listar" element={<PageHistorialPedido />} /> 
        {/* Más rutas anidadas si es necesario */}
      </Route>
      {/* </Route>  */}
    </Routes>
  );
}