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
        [p.tienda, p.pais, p.trazabilidad_Prod, p.proveedor]
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

  const recibidos = filtered;
  const pendientesQA = filtered.filter(() => true);
  const listosSAP = filtered.filter(() => false);

  return {
    search,
    setSearch,
    date,
    setDate,
    recibidos,
    pendientesQA,
    listosSAP,
    isLoading,
    isFetching,
    refetch,
  };
}
