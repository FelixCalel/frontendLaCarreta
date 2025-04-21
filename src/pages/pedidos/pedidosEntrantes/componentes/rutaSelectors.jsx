import { createSelector } from "@reduxjs/toolkit";

const EMPTY = [];

export const selectPedidosEntrantesPorRuta = createSelector(
  [
    (s) => s.pedidos.data ?? EMPTY,
    (s) => s.tiendas.data ?? EMPTY,
    (s) => s.auth.rutas ?? EMPTY,
  ],
  (pedidos, tiendas, rutasUsuario) => {
    if (!rutasUsuario.length || !tiendas.length) return EMPTY;

    const rutasSet = new Set(
      rutasUsuario.map((r) =>
        typeof r === "object" ? Number(r.id) : Number(r)
      )
    );

    const tiendaRuta = new Map(tiendas.map((t) => [t.id, Number(t.rutaId)]));

    const filtrados = pedidos.filter(
      (p) => p.estadoId === 2 && rutasSet.has(tiendaRuta.get(p.tiendaId))
    );

    if (import.meta.env.DEV) {
      console.log("[selector] rutasSet", [...rutasSet]);
      console.log(
        "[selector] pedidos filtrados",
        filtrados.map((p) => p.id)
      );
    }

    return filtrados;
  }
);
