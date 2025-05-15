import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import {
  PagePerfil,
  Dashboard,
  PageUsuarios,
  PageRoles,
  PageOrdenes,
  PageFacturas,
} from "../pages";
import { Logout } from "../pages/auth/Logout";
import { PagePermisos } from "../pages/PagePermisos";
import { PageListarUsuarios } from "../pages/Usuarios/PageListarUsuarios";
import { PageModulos } from "../pages/Modulos/PageModulos";
import { PageOpciones } from "../pages/Opciones/PageOpciones";
import { PaginaRole } from "../pages/Roles/PaginaRole";
import { PagePermiso } from "../pages/Permisos/PagePermiso";
import { PagePermisosRoles } from "../pages/asignarPermisosAroles/PagePermisosRoles";
import { PageasignacionMO } from "../pages/asignacionMO/asignacionMO";
import PageFormDeus from "../pages/deus/pageFormDeus";
import AprobadosPage from "../pages/pedidos/paginaExportacion/pageFormExportacion";
import PedidosEntrantesPage from "../pages/Compras/pedidosEntrantesCompras/pedidosEntrantesPageCompras";
import ControlCalidadPage from "../pages/ControlCalidad/pageFormControlCalidad";

export const PortalRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="perfil" element={<PagePerfil />} />
        <Route path="usuarios" element={<PageUsuarios />} />
        <Route path="roles" element={<PageRoles />} />
        <Route path="permisos" element={<PagePermisos />} />
        <Route path="ordenes" element={<PageOrdenes />} />
        <Route path="facturas" element={<PageFacturas />} />
        <Route path="logout" element={<Logout />}></Route>
        <Route path="listarUsuarios" element={<PageListarUsuarios />} />
        <Route path="Modulos/listarModulos" element={<PageModulos />} />
        <Route path="listarOpciones" element={<PageOpciones />} />
        <Route path="listarRoles" element={<PaginaRole />} />
        <Route path="listarPermisos" element={<PagePermiso />} />
        <Route path="listarPermisosRoles" element={<PagePermisosRoles />} />
        <Route path="listarasignacionMO" element={<PageasignacionMO />} />
        <Route path="listarDeus" element={<PageFormDeus />} />
        <Route path="exportarPedidos" element={<AprobadosPage />} />
        <Route path="listarCompras" element={<PedidosEntrantesPage />} />
        <Route path="ControlCalidad" element={<ControlCalidadPage />} />
      </Route>
    </Routes>
  );
};
