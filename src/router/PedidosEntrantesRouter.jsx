import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import PagePedidoEntrante from "../pages/pedidos/pedidosEntrantes/pageFormPedidosEntrantes";

 
export const PaginaPedidosEntrantes = () => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Dashboard />} > */}
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        
        <Route path="Entrantes" element={<PagePedidoEntrante />} /> 
        {/* Más rutas anidadas si es necesario */}
      </Route>
      {/* </Route>  */}
    </Routes>
  );
}