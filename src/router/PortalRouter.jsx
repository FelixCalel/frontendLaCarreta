import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { PagePerfil,Dashboard, PageEmpresa, PageUsuarios, PageRoles, PageOrdenes, PageFacturas } from "../pages";
import { Logout } from "../pages/auth/Logout";
import { PagePermisos } from "../pages/PagePermisos";

import { PageListarUsuarios } from "../pages/Usuarios/PageListarUsuarios.jsx";
import { PageModulos } from "../pages/Modulos/PageModulos";
import { PageOpciones } from "../pages/Opciones/PageOpciones";
import { PaginaRole } from "../pages/Roles/PaginaRole.jsx";
import { PagePermiso } from "../pages/Permisos/PagePermiso";
import { PagePermisosRoles } from "../pages/asignarPermisosAroles/PagePermisosRoles"; 
import { PageasignacionMO } from "../pages/asignacionMO/asignacionMO";
import PageFormDeus from "../pages/deus/pageFormDeus.jsx";
import AprobadosPage from "../pages/pedidos/paginaExportacion/pageFormExportacion"


export const PortalRouter = () => {
  return (
    <Routes>
      {/* <Route path="/*" element={<Dashboard />} > */}
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        {/* <Route path="dashboard" element={<Dashboard />} />  */}
        <Route path="perfil" element={<PagePerfil />} />
        <Route path="empresas" element={<PageEmpresa />} />
        <Route path="usuarios" element={<PageUsuarios />} />
        
        <Route path="roles" element={<PageRoles />} />
        <Route path="permisos" element={<PagePermisos />} />
        <Route path="ordenes" element={<PageOrdenes />} />
        <Route path="facturas" element={<PageFacturas />} />
        <Route path="logout" element={<Logout /> }></Route>

        <Route path="listarUsuarios" element={<PageListarUsuarios />}> </Route>
        <Route path="Modulos/listarModulos" element={<PageModulos />} > </Route>
        <Route path="listarOpciones" element={<PageOpciones />} > </Route>
        <Route path="listarRoles" element={<PaginaRole />} > </Route>
        <Route path="listarPermisos" element={<PagePermiso />} > </Route>
        <Route path="listarPermisosRoles" element={<PagePermisosRoles />} ></Route>
        <Route path="listarasignacionMO" element={<PageasignacionMO />} > </Route>
        <Route path="listarDeus" element={<PageFormDeus />} > </Route>
        <Route path="exportarPedidos" element={< AprobadosPage/>} > </Route>
    

        {/* Más rutas anidadas si es necesario */}
      </Route>
      {/* </Route>  */}
    </Routes>
  );
}