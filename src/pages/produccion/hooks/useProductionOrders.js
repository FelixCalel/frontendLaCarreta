import { useState, useMemo, useEffect, useTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import {
  useGetPedidosAgrupadosQuery,
  useProcesarEstado5Mutation,
  useGetUnassignedOrdersQuery,
} from "../../../services/pedidoProductionApi";

export const useProductionOrders = () => {
  const navigate = useNavigate();
  const { pedidoId } = useParams();
  const [countryFilter, setCountryFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [deuFilter, setDeuFilter] = useState("");
  const [syncReady, setSyncReady] = useState(false);
  const [viewMode, setViewMode] = useState("byOrder");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPending, startTransition] = useTransition();

  const [procesarEstado5] = useProcesarEstado5Mutation();
  const { data: unassignedData = [] } = useGetUnassignedOrdersQuery(undefined, { skip: !syncReady });
  const { data: agrupados = [], isLoading, error } = useGetPedidosAgrupadosQuery({ etapaId: 1 }, { skip: !syncReady });

  const unassignedCount = useMemo(() => unassignedData.reduce((acc, g) => acc + g.items.length, 0), [unassignedData]);

  useEffect(() => {
    const run = async () => {
      try { await procesarEstado5(undefined).unwrap(); }
      catch (e) { console.error(e); }
      finally { setSyncReady(true); }
    };
    run();
  }, [procesarEstado5]);

  const mesaGroups = useMemo(() => agrupados.map((g) => ({
    ...g,
    items: g.items.map((i) => ({ ...i, pedidoId: g.pedidoId, tienda: g.tienda, deudorCodigo: g.deudorCodigo, deudorNombre: g.deudorNombre, cantidadUnidad: Number(i.cantidadUnidad) || 0 }))
  })).filter((g) => g.items.length > 0), [agrupados]);

  const allItems = useMemo(() => mesaGroups.flatMap((g) => g.items), [mesaGroups]);

  const filters = useMemo(() => ({
    countries: Array.from(new Set(allItems.map((i) => i.pais))),
    clients: Array.from(new Set(allItems.map((i) => i.tienda))),
    deudores: Array.from(new Set(allItems.map((i) => i.deudorCodigo))).filter(Boolean).sort()
  }), [allItems]);

  const filteredGroups = useMemo(() => {
    return mesaGroups
      .filter((g) => !deuFilter || g.items.some((i) => i.deudorCodigo === deuFilter))
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => !deuFilter || i.deudorCodigo === deuFilter).sort((a, b) => a.productoNombre.localeCompare(b.productoNombre))
      }))
      .filter((g) => g.items.length > 0)
      .filter((g) => {
        if (countryFilter && g.pais !== countryFilter) return false;
        if (clientFilter && g.tienda !== clientFilter) return false;
        if (stateFilter) {
          const total = g.items.length;
          const done = g.items.filter((i) => i.completo).length;
          const progress = g.items.some((i) => Number(i.cantidad ?? 0) > 0);
          const status = done === total ? "Completado" : progress ? "En Proceso" : "Pendiente";
          if (status !== stateFilter) return false;
        }
        return true;
      })
      .sort((a, b) => a.pedidoId - b.pedidoId);
  }, [mesaGroups, countryFilter, clientFilter, stateFilter, deuFilter]);

  const consolidatedItems = useMemo(() => {
    if (viewMode !== "consolidated") return [];
    const map = new Map();
    filteredGroups.forEach((g) => {
      g.items.forEach((i) => {
        const key = `${i.deudorCodigo || ""}|${i.productoNombre}`;
        if (map.has(key)) {
          const e = map.get(key);
          e.cantidadUnidad += Number(i.cantidadUnidad || 0);
          e.cantidad += Number(i.cantidad || 0);
          e.originalItems.push(i);
        } else {
          map.set(key, { ...i, originalItems: [i] });
        }
      });
    });
    return Array.from(map.values()).sort((a,b) => (a.deudorCodigo||"").localeCompare(b.deudorCodigo||"") || a.productoNombre.localeCompare(b.productoNombre));
  }, [filteredGroups, viewMode]);

  return {
    navigate, pedidoId,
    countryFilter, setCountryFilter: (v) => startTransition(() => setCountryFilter(v)),
    clientFilter, setClientFilter: (v) => startTransition(() => setClientFilter(v)),
    stateFilter, setStateFilter: (v) => startTransition(() => setStateFilter(v)),
    deuFilter, setDeuFilter: (v) => startTransition(() => setDeuFilter(v)),
    viewMode, setViewMode,
    isOpen, onOpen, onClose,
    isLoading, error, syncReady,
    unassignedCount,
    filters, filteredGroups, consolidatedItems,
    isPending
  };
};
