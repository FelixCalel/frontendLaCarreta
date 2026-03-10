import { useMemo } from "react";

export const useSupervisorOrdersLogic = ({ agrupados, filters, viewMode }) => {
  const { itemFilter, countryFilter, clientFilter, stateFilter } = filters;

  const pedidoGroups = useMemo(
    () =>
      agrupados
        .map((g) => ({
          pedidoId: g.pedidoId,
          tienda: g.tienda,
          pais: g.pais,
          deudorCodigo: g.deudorCodigo,
          deudorNombre: g.deudorNombre,
          items: g.items.map((item) => ({
            ...item,
            pedidoId: g.pedidoId,
            tienda: g.tienda,
            deudorCodigo: g.deudorCodigo,
            deudorNombre: g.deudorNombre,
            cantidadUnidad: Number(item.cantidadUnidad ?? 0),
            cantidad: Number(item.cantidad ?? 0),
            faltante: Number(item.faltante ?? 0),
            mpUtilizada: Number(item.mpUtilizada ?? 0),
            mp1ra: Number(item.mp1ra ?? 0),
            mp2da: Number(item.mp2da ?? 0),
            mp3ra: Number(item.mp3ra ?? 0),
            mpSobrante: Number(item.mpSobrante ?? 0),
            rechazo: Number(item.rechazo ?? 0),
            basura: Number(item.basura ?? 0),
            cantidadRechazada: Number(item.cantidadRechazada ?? 0),
          })),
        }))
        .filter((g) => g.items.length > 0),
    [agrupados],
  );

  const allItems = useMemo(
    () => pedidoGroups.flatMap((g) => g.items),
    [pedidoGroups],
  );
  const countries = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.pais))),
    [allItems],
  );
  const clients = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.tienda))),
    [allItems],
  );

  const filteredGroups = useMemo(() => {
    return pedidoGroups
      .map((g) => {
        const filteredItems = g.items
          .filter((i) => {
            if (!itemFilter) return true;
            return i.productoNombre
              .toLowerCase()
              .includes(itemFilter.toLowerCase());
          })
          .slice()
          .sort((a, b) =>
            a.productoNombre.localeCompare(b.productoNombre, undefined, {
              sensitivity: "base",
            }),
          );

        return {
          ...g,
          items: filteredItems,
        };
      })
      .filter((g) => g.items.length > 0)
      .filter((g) => {
        if (countryFilter && g.pais !== countryFilter) return false;
        if (clientFilter && g.tienda !== clientFilter) return false;

        if (stateFilter) {
          const total = g.items.length;
          const doneCount = g.items.filter((i) => i.completo).length;
          const anyProgress = g.items.some((i) => Number(i.cantidad ?? 0) > 0);
          const groupStatus =
            doneCount === total
              ? "Completado"
              : anyProgress
                ? "En Proceso"
                : "Pendiente";
          if (groupStatus !== stateFilter) return false;
        }

        return true;
      })
      .slice()
      .sort((a, b) => a.pedidoId - b.pedidoId);
  }, [pedidoGroups, itemFilter, countryFilter, clientFilter, stateFilter]);

  const consolidatedItems = useMemo(() => {
    if (viewMode !== "consolidated") return [];

    const allFilteredItems = filteredGroups.flatMap((g) => g.items);
    const itemsMap = new Map();

    allFilteredItems.forEach((item) => {
      const deuCode = item.deudorCodigo || "";
      const key = `${deuCode}|${item.productoNombre}`;
      if (itemsMap.has(key)) {
        const existing = itemsMap.get(key);
        existing.cantidadUnidad += Number(item.cantidadUnidad ?? 0);
        existing.cantidad += Number(item.cantidad ?? 0);
        existing.mpUtilizada += Number(item.mpUtilizada ?? 0);
        existing.rechazo += Number(item.rechazo ?? 0);
        existing.cantidadRechazada += Number(item.cantidadRechazada ?? 0);
        existing.originalItems.push(item);
      } else {
        itemsMap.set(key, {
          ...item,
          cantidadUnidad: Number(item.cantidadUnidad ?? 0),
          cantidad: Number(item.cantidad ?? 0),
          mpUtilizada: Number(item.mpUtilizada ?? 0),
          rechazo: Number(item.rechazo ?? 0),
          cantidadRechazada: Number(item.cantidadRechazada ?? 0),
          originalItems: [item],
        });
      }
    });

    return Array.from(itemsMap.values()).sort((a, b) => {
      const deuCompare = (a.deudorCodigo || "").localeCompare(
        b.deudorCodigo || "",
        undefined,
        {
          sensitivity: "base",
        },
      );
      if (deuCompare !== 0) return deuCompare;
      return a.productoNombre.localeCompare(b.productoNombre, undefined, {
        sensitivity: "base",
      });
    });
  }, [filteredGroups, viewMode]);

  return {
    filteredGroups,
    consolidatedItems,
    countries,
    clients,
  };
};
