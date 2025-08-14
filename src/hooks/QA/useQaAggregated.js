import { useMemo, useState } from "react";
import { useGetQaAgrupadosQuery } from "../../services/controlCalidadAPI";

const DEC = {
  PENDIENTE: "PENDIENTE",
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO",
};

const norm = (d) => {
  const v = (d ?? "").trim().toUpperCase();
  return v === "" ? null : v;
};

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
        [p.tienda, p.pais, p.trazabilidad]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(s))
      );
    }

    if (date) {
      rows = rows
        .map((p) => ({
          ...p,
          items: p.items.filter((it) => {
            const d =
              typeof it.createdAt === "string"
                ? it.createdAt
                : new Date(it.createdAt).toISOString();
            return d.slice(0, 10) === date;
          }),
        }))
        .filter((p) => p.items.length > 0);
    }

    return rows;
  }, [data, search, date]);

  const listosSAP = useMemo(
    () =>
      filtered.filter(
        (p) =>
          p.items.length > 0 &&
          p.items.every((it) => norm(it.muestreoDecision) === DEC.APROBADO)
      ),
    [filtered]
  );
  const listosIds = useMemo(
    () => new Set(listosSAP.map((p) => p.pedidoId)),
    [listosSAP]
  );

  const recibidos = useMemo(
    () =>
      filtered.filter(
        (p) =>
          p.items.length > 0 &&
          p.items.every((it) => norm(it.muestreoDecision) == null)
      ),
    [filtered]
  );
  const recibIds = useMemo(
    () => new Set(recibidos.map((p) => p.pedidoId)),
    [recibidos]
  );

  const pendientesQA = useMemo(
    () =>
      filtered.filter(
        (p) => !listosIds.has(p.pedidoId) && !recibIds.has(p.pedidoId)
      ),
    [filtered, listosIds, recibIds]
  );

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
