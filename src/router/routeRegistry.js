import HomePage from "../pages/auth/HomePage";
import { PortalRouter } from "./PortalRouter";
import { PaginaPais } from "./PaisRoute";
import { PaginaEmpresa } from "./EmpresaRoute";
import { PaginaCiudad } from "./CiudaRouter";
import { PaginaTienda } from "./TiendaRouter";
import { PaginaRuta } from "./RutaRouter";
import { PaginaPedido } from "./PedidosRouter";
import { PaginaPedidosEntrantes } from "./PedidosEntrantesRouter";
import { PaginaDeu } from "./DeuRoute";
import { PaginaItem } from "./ItemRouter";
import { PaginaHistorialPedido } from "./HistorialPedidoRouter";
import { PaginaExportacionPedido } from "./exportarPedidosRouter";
import { PaginaPedidoCompras } from "./ComprasRouter";
import { PaginaComprador } from "./CompradorRouter";
import { PaginaControlCalidad } from "./ControlCalidadRouter";
import { PaginaAsignacionAM } from "./AsignacionAreaMesaRoute";
import { produccionOrden } from "./pedidoProduccion";
import { produccionOrdenSuper } from "./supervisorProduction";
import { productionOrdenDetails } from "./pedidoProductionDetail";
import { digitadorOrden } from "./digitadorOrden";
import { digitadorDetalleOrden } from "./detalleDigitadorOrden";
import { digitadorFabricacionOrden } from "./digitadorFabricacionOrden";
import { fabricacionDetailOrder } from "./FabricacionDetails";

export const ROUTE_REGISTRY = {
  "/auth/home": HomePage,
  "/admin/*": PortalRouter,
  "/pais/*": PaginaPais,
  "/ciudad/*": PaginaCiudad,
  "/ruta/*": PaginaRuta,
  "/tienda/*": PaginaTienda,
  "/empresa/*": PaginaEmpresa,
  "/pedido/*": PaginaPedido,
  "/pedidos/*": PaginaPedidosEntrantes,
  "/deus/*": PaginaDeu,
  "/items/*": PaginaItem,
  "/historialPedido/*": PaginaHistorialPedido,
  "/exportarPedido/*": PaginaExportacionPedido,
  "/comprasPedidos/*": PaginaPedidoCompras,
  "/comprador/*": PaginaComprador,
  "/ControlCalidad/*": PaginaControlCalidad,
  "/asignacion-areas/*": PaginaAsignacionAM,
  "/mesa/*": produccionOrden,
  "/produccion/*": produccionOrdenSuper,
  "/despacho/*": productionOrdenDetails,
  "/digitador/*": digitadorOrden,
  "/detalle/*": digitadorDetalleOrden,
  "/fabricacion/*": digitadorFabricacionOrden,
  "/detalleFabricacion/*": fabricacionDetailOrder,
};
