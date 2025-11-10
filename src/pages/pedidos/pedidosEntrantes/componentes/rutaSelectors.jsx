import { createSelector } from "@reduxjs/toolkit";

export const selectPedidosEntrantesPorRuta = (estadoIds = [2]) =>
  createSelector(
    [
      /* 1 */ (s) => s.pedidos.data ?? [],
      /* 2 */ (s) => s.tiendas.data ?? [],
      /* 3 */ (s) =>
        (s.auth.user?.rutas?.length ? s.auth.user.rutas : s.auth.rutas) ?? [],
    ],
    (pedidos, tiendas, rutasUsuario) => {
      if (!rutasUsuario.length || !tiendas.length) return [];

      const rutasSet = new Set(
        rutasUsuario.map((r) => (typeof r === "object" ? +r.id : +r))
      );
      const tiendaRuta = new Map(tiendas.map((t) => [t.id, +t.rutaId]));

      const pedidosFiltrados = pedidos.filter(
        (p) =>
          rutasSet.has(tiendaRuta.get(p.tiendaId)) &&
          estadoIds.includes(p.estadoId)
      );

      // Ordenar por ID descendente (más recientes primero)
      return pedidosFiltrados.sort((a, b) => b.id - a.id);
    }
  );
