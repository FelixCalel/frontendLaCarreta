import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortalRouter } from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import CheckingAuth from "../ui/components/CheckingAuth";
import HomePage from "../pages/auth/HomePage";
import { PaginaPais } from "./PaisRoute";
import { PaginaEmpresa } from "./EmpresaRoute";
import { PaginaCiudad } from "./CiudaRouter";
import { PaginaTienda } from "./TiendaRouter";
import { PaginaRuta } from "./RutaRouter";
import { PaginaPedido } from "./PedidosRouter";
import { PaginaPedidosEntrantes } from "./PedidosEntrantesRouter";
import { validarUsuario } from "../store/RolPermisoUsuario/thunks";
import { PaginaDeu } from "../router/DeuRoute";
import { PaginaItem } from "../router/ItemRouter";
import { PaginaHistorialPedido } from "../router/HistorialPedidoRouter";
import { PaginaExportacionPedido } from "../router/exportarPedidosRouter";
import { PaginaPedidoCompras } from "../router/ComprasRouter";
import { PaginaComprador } from "../router/CompradorRouter";
import { PaginaControlCalidad } from "../router/ControlCalidadRouter";
import { PaginaAsignacionAM } from "./AsignacionAreaMesaRoute";
import { produccionOrden } from "./pedidoProduccion";
import { produccionOrdenSuper } from "./supervisorProduction";
import { productionOrdenDetails } from "./pedidoProductionDetail";
import { digitadorOrden } from "./digitadorOrden";
import { digitadorDetalleOrden } from "./detalleDigitadorOrden";
import { digitadorFabricacionOrden } from "./digitadorFabricacionOrden";
import { fabricacionDetailOrder } from "./FabricacionDetails";

export const AppRouter = () => {
  const dispatch = useDispatch();
  const [accesosPermitidos, setAccesosPermitidos] = useState({});
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(localStorage.getItem("roleId"));
  const usuarioId = localStorage.getItem("usuarioId");

  const rutasConRutaId = [
    { path: "/pais/*", rutaId: 1, component: PaginaPais },
    { path: "/ciudad/*", rutaId: 2, component: PaginaCiudad },
    { path: "/ruta/*", rutaId: 3, component: PaginaRuta },
    { path: "/tienda/*", rutaId: 4, component: PaginaTienda },
    { path: "/empresa/*", rutaId: 5, component: PaginaEmpresa },
    { path: "/pedido/*", rutaId: 6, component: PaginaPedido },
    { path: "/pedidos/*", rutaId: 7, component: PaginaPedidosEntrantes },
    { path: "/deus/*", rutaId: 8, component: PaginaDeu },
    { path: "/items/*", rutaId: 10, component: PaginaItem },
    {
      path: "/historialPedido/*",
      rutaId: 11,
      component: PaginaHistorialPedido,
    },
    {
      path: "/exportarPedido/*",
      rutaId: 12,
      component: PaginaExportacionPedido,
    },
    { path: "/comprasPedidos/*", rutaId: 13, component: PaginaPedidoCompras },
    { path: "/comprador/*", rutaId: 14, component: PaginaComprador },
    { path: "/ControlCalidad/*", rutaId: 15, component: PaginaControlCalidad },
    { path: "/area1/*", rutaId: 18, component: PaginaAsignacionAM },
    { path: "/area2/*", rutaId: 19, component: PaginaAsignacionAM },
    { path: "/area3/*", rutaId: 20, component: PaginaAsignacionAM },
    { path: "/area4/*", rutaId: 21, component: PaginaAsignacionAM },
    { path: "/area5/*", rutaId: 22, component: PaginaAsignacionAM },
    { path: "/mesa/*", rutaId: 23, component: produccionOrden },
    { path: "/produccion/*", rutaId: 24, component: produccionOrdenSuper },
    { path: "/despacho/*", rutaId: 25, component: productionOrdenDetails },
    { path: "/digitador/*", rutaId: 26, component: digitadorOrden },
    { path: "/detalle/*", rutaId: 27, component: digitadorDetalleOrden },
    {
      path: "/fabricacion/*",
      rutaId: 28,
      component: digitadorFabricacionOrden,
    },
    {
      path: "/detalleFabricacion/*",
      rutaId: 29,
      component: fabricacionDetailOrder,
    },
  ];

  useEffect(() => {
    const storedRoleId = localStorage.getItem("roleId");
    setRoleId(storedRoleId);
  }, []);

  useEffect(() => {
    const verificarAccesos = async () => {
      if (roleId && usuarioId) {
        const nuevosAccesosPermitidos = {};

        await Promise.all(
          rutasConRutaId.map(async ({ rutaId, path }) => {
            const result = await dispatch(
              validarUsuario({ usuarioId, rutaId })
            );
            nuevosAccesosPermitidos[path] = result.payload;
          })
        );

        setAccesosPermitidos(nuevosAccesosPermitidos);
      }
      setLoading(false);
    };

    verificarAccesos();
  }, [dispatch, usuarioId, roleId]);

  const rolesPermitidosAdmin = ["1", "2", "3", "4", "5", "6", "9"];

  if (loading) {
    return <CheckingAuth />;
  }

  return (
    <Routes>
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <PortalPagePublic />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      {rolesPermitidosAdmin.includes(roleId) ? (
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <PortalRouter />
            </PrivateRoute>
          }
        />
      ) : (
        <Route path="/admin/*" element={<Navigate to="/auth/home" />} />
      )}
      {rutasConRutaId.map(({ path, component: Component }) =>
        accesosPermitidos[path] ? (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute>
                <Component />
              </PrivateRoute>
            }
          />
        ) : (
          <Route
            key={path}
            path={path}
            element={<Navigate to="/auth/home" />}
          />
        )
      )}

      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
