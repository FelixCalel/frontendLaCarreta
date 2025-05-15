import { Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import {
  Dashboard,
  PagePerfil,
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
import PageFormPais from "../pages/pais/PageFormPais";
import HomePage from "../pages/auth/HomePage";

export const PortalRouter = () => (
  <Routes>
    <Route element={<RootLayout />}>
      {/* dashboard */}
      <Route index element={<HomePage />} />
      <Route path="perfil" element={<PagePerfil />} />
      <Route path="usuarios" element={<PageUsuarios />} />
      <Route path="permisos" element={<PagePermisos />} />
      <Route path="ordenes" element={<PageOrdenes />} />
      <Route path="facturas" element={<PageFacturas />} />
      <Route path="logout" element={<Logout />} />

      {/* catálogo / config */}
      <Route path="listar-usuarios" element={<PageListarUsuarios />} />
      <Route path="modulos" element={<PageModulos />} />
      <Route path="opciones" element={<PageOpciones />} />
      <Route path="roles" element={<PaginaRole />} />
      <Route path="permisos/listar" element={<PagePermiso />} />
      <Route path="permisos/por-rol" element={<PagePermisosRoles />} />
      <Route path="asignacion-mo" element={<PageasignacionMO />} />
      <Route path="pais" element={<PageFormPais />} />

      {/* procesos */}
      <Route path="deus" element={<PageFormDeus />} />
      <Route path="exportar-pedidos" element={<AprobadosPage />} />
      <Route path="compras" element={<PedidosEntrantesPage />} />
      <Route path="control-calidad" element={<ControlCalidadPage />} />

      {/* fallback interno */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Route>
  </Routes>
);
