import { createSelector } from "@reduxjs/toolkit";

export const selectPedidosEntrantesPorRuta = (estados = []) =>
  createSelector(
    [
      (state) => state.pedidos.data || [],
      (state) => state.tiendas.data || [],
      (state) => {
        const rutasAuth = state.auth.user?.rutas ?? state.auth.rutas ?? [];
        return rutasAuth.map((r) =>
          typeof r === "object" ? { id: Number(r.id) } : { id: Number(r) }
        );
      },
    ],
    (pedidos, tiendas, rutasUsuario) => {
      if (!rutasUsuario.length || !tiendas.length) return [];

      const rutasSet = new Set(rutasUsuario.map((r) => r.id));
      const tiendaRuta = new Map(tiendas.map((t) => [t.id, Number(t.rutaId)]));

      return pedidos.filter(
        (p) =>
          estados.includes(p.estadoId) &&
          rutasSet.has(tiendaRuta.get(p.tiendaId))
      );
    }
  );
