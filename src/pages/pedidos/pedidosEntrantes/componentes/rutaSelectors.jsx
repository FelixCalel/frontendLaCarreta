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
      // console.log("Selector Debug:", { pedidos: pedidos.length, tiendas: tiendas.length, rutasUsuario });
      if (!rutasUsuario.length || !tiendas.length) return [];

      const rutasSet = new Set(
        rutasUsuario.map((r) => (typeof r === "object" ? +r.id : +r))
      );
      
      const tiendaRuta = new Map(tiendas.map((t) => [t.id, +t.rutaId]));

      const pedidosFiltrados = pedidos.filter(
        (p) => {
            const rutaTienda = tiendaRuta.get(p.tiendaId);
            const hasRuta = rutasSet.has(rutaTienda);
            const hasEstado = estadoIds.includes(p.estadoId);
            
            // Log only for relevant orders to avoid spam
            if (p.estadoId === 2 && !hasRuta) {
                 console.log(`Pedido ${p.id} rechazado por ruta. Tienda: ${p.tiendaId}, RutaTienda: ${rutaTienda}, RutasUsuario: ${Array.from(rutasSet)}`);
            }
            
            return hasRuta && hasEstado;
        }
      );

      // Ordenar por ID descendente (más recientes primero)
      return pedidosFiltrados.sort((a, b) => b.id - a.id);
    }
  );
