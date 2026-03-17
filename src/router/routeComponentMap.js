import { lazy } from "react";

const PaginaPais = lazy(() =>
  import("./PaisRoute").then((module) => ({ default: module.PaginaPais })),
);
const PaginaEmpresa = lazy(() =>
  import("./EmpresaRoute").then((module) => ({
    default: module.PaginaEmpresa,
  })),
);
const PaginaCiudad = lazy(() =>
  import("./CiudaRouter").then((module) => ({ default: module.PaginaCiudad })),
);
const PaginaTienda = lazy(() =>
  import("./TiendaRouter").then((module) => ({ default: module.PaginaTienda })),
);
const PaginaRuta = lazy(() =>
  import("./RutaRouter").then((module) => ({ default: module.PaginaRuta })),
);
const PaginaPedido = lazy(() =>
  import("./PedidosRouter").then((module) => ({
    default: module.PaginaPedido,
  })),
);
const PaginaPedidosEntrantes = lazy(() =>
  import("./PedidosEntrantesRouter").then((module) => ({
    default: module.PaginaPedidosEntrantes,
  })),
);
const PaginaDeu = lazy(() =>
  import("./DeuRoute").then((module) => ({ default: module.PaginaDeu })),
);
const PaginaItem = lazy(() =>
  import("./ItemRouter").then((module) => ({ default: module.PaginaItem })),
);
const PaginaHistorialPedido = lazy(() =>
  import("./HistorialPedidoRouter").then((module) => ({
    default: module.PaginaHistorialPedido,
  })),
);
const PaginaExportacionPedido = lazy(() =>
  import("./exportarPedidosRouter").then((module) => ({
    default: module.PaginaExportacionPedido,
  })),
);
const PaginaPedidoCompras = lazy(() =>
  import("./ComprasRouter").then((module) => ({
    default: module.PaginaPedidoCompras,
  })),
);
const PaginaComprador = lazy(() =>
  import("./CompradorRouter").then((module) => ({
    default: module.PaginaComprador,
  })),
);
const PaginaControlCalidad = lazy(() =>
  import("./ControlCalidadRouter").then((module) => ({
    default: module.PaginaControlCalidad,
  })),
);
const PaginaAsignacionAM = lazy(() =>
  import("./AsignacionAreaMesaRoute").then((module) => ({
    default: module.PaginaAsignacionAM,
  })),
);
const produccionOrden = lazy(() =>
  import("./pedidoProduccion").then((module) => ({
    default: module.produccionOrden,
  })),
);
const produccionOrdenSuper = lazy(() =>
  import("./supervisorProduction").then((module) => ({
    default: module.produccionOrdenSuper,
  })),
);
const productionOrdenDetails = lazy(() =>
  import("./pedidoProductionDetail").then((module) => ({
    default: module.productionOrdenDetails,
  })),
);
const digitadorOrden = lazy(() =>
  import("./digitadorOrden").then((module) => ({
    default: module.digitadorOrden,
  })),
);
const digitadorDetalleOrden = lazy(() =>
  import("./detalleDigitadorOrden").then((module) => ({
    default: module.digitadorDetalleOrden,
  })),
);
const digitadorFabricacionOrden = lazy(() =>
  import("./digitadorFabricacionOrden").then((module) => ({
    default: module.digitadorFabricacionOrden,
  })),
);
const fabricacionDetailOrder = lazy(() =>
  import("./FabricacionDetails").then((module) => ({
    default: module.fabricacionDetailOrder,
  })),
);
const QApaginaPedido = lazy(() =>
  import("./QA").then((module) => ({ default: module.QApaginaPedido })),
);
const QApaginaDetails = lazy(() =>
  import("./QADetails").then((module) => ({ default: module.QApaginaDetails })),
);
const historialSapRoute = lazy(() =>
  import("./HistorialSapRoute").then((module) => ({ default: module.historialSapRoute })),
);

export const routeComponentMap = {
  "/pais": PaginaPais,
  "/ciudad": PaginaCiudad,
  "/ruta": PaginaRuta,
  "/tienda": PaginaTienda,
  "/empresa": PaginaEmpresa,
  "/pedido": PaginaPedido,
  "/pedidos": PaginaPedidosEntrantes,
  "/deus": PaginaDeu,
  "/items": PaginaItem,
  "/historialPedido": PaginaHistorialPedido,
  "/exportarPedido": PaginaExportacionPedido,
  "/comprasPedidos": PaginaPedidoCompras,
  "/comprador": PaginaComprador,
  "/ControlCalidad": PaginaControlCalidad,
  "/asignacion-areas": PaginaAsignacionAM,
  "/mesa": produccionOrden,
  "/produccion": produccionOrdenSuper,
  "/despacho": productionOrdenDetails,
  "/digitador": digitadorOrden,
  "/detalle": digitadorDetalleOrden,
  "/fabricacion": digitadorFabricacionOrden,
  "/detalleFabricacion": fabricacionDetailOrder,
  "/aseguramiento": QApaginaPedido,
  "/qa": QApaginaDetails,
  "/historialSapDetalle": historialSapRoute,
};
