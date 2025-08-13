import { useMemo, useState } from "react";
import { useGetQaAgrupadosQuery } from "../../services/controlCalidadAPI";

export default function useQaAggregated() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(null);

  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetQaAgrupadosQuery();

  const filtered = useMemo(() => {
    let rows = data;

    if (search?.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter((p) =>
        [p.tienda, p.pais, p.trazabilidad, p.proveedor]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(s))
      );
    }

    if (date) {
      rows = rows
        .map((p) => ({
          ...p,
          items: p.items.filter((it) => it.createdAt?.slice(0, 10) === date),
        }))
        .filter((p) => p.items.length > 0);
    }

    return rows;
  }, [data, search, date]);

  const lotesRecibidos = filtered.filter((p) =>
    p.items.some((it) => it.estado === true)
  );

  const pendientesQA = filtered.filter((p) =>
    p.items.some((it) => it.estado === false)
  );

  const listosSAP = filtered.filter((p) =>
    p.items.some((it) => it.enviadoASap === true)
  );

  return {
    search,
    setSearch,
    date,
    setDate,
    recibidos: lotesRecibidos,
    pendientesQA,
    listosSAP,
    isLoading,
    isFetching,
    refetch,
  };
}
