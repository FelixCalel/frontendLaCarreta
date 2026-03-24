import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import {
  useGetPedidosAgrupadosQuery,
  useProcesarEstado5Mutation,
  useGetUnassignedOrdersQuery,
} from "../../../../services/pedidoProductionApi";
import { tablaEmpresa, tablaPais } from "../../../../store/Empresa/thunks";
import { useSupervisorOrdersLogic } from "./useSupervisorOrdersLogic";

export const useSupervisorOrders = ( pedidoId ) => {
  const dispatch = useDispatch();
  const { data: empresas, paises } = useSelector((state) => state.empresas);
  const [countryFilter, setCountryFilter] = useState("");
  const [itemFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [dateMode, setDateMode] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [syncReady, setSyncReady] = useState(false);
  const [procesarEstado5] = useProcesarEstado5Mutation();
  const [viewMode, setViewMode] = useState("byOrder");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: unassignedData = [] } = useGetUnassignedOrdersQuery(undefined, {
    skip: !syncReady,
  });
  const unassignedCount = unassignedData.reduce((acc, g) => acc + g.items.length, 0);

  useEffect(() => {
    dispatch(tablaEmpresa());
    dispatch(tablaPais());
  }, [dispatch]);

  const empresaActiva = useMemo(() => {
    if (!countryFilter || !empresas || !paises) return null;
    const p = paises.find((p) => p.nombre === countryFilter);
    return p ? empresas.find((e) => e.paisId === p.id) : null;
  }, [countryFilter, empresas, paises]);

  const empresaParaMostrar = empresaActiva || (empresas?.length > 0 ? empresas[0] : null);

  useEffect(() => {
    const runProcess = async () => {
      try { await procesarEstado5(undefined).unwrap(); }
      catch (e) { console.error(e); }
      finally { setSyncReady(true); }
    };
    runProcess();
  }, [procesarEstado5]);

  const { data: agrupados = [], isLoading, error } = useGetPedidosAgrupadosQuery(
    { etapaId: 2 }, { skip: !syncReady }
  );

  const { filteredGroups, consolidatedItems, countries, clients } = useSupervisorOrdersLogic({
    agrupados,
    filters: { itemFilter, countryFilter, clientFilter, stateFilter, dateMode, dateFilter },
    viewMode,
  });

  const selectedGroup = useMemo(() => 
    filteredGroups.find((g) => g.pedidoId === Number(pedidoId)),
    [filteredGroups, pedidoId]
  );

  return {
    countryFilter, setCountryFilter,
    clientFilter, setClientFilter,
    stateFilter, setStateFilter,
    dateMode, setDateMode,
    dateFilter, setDateFilter,
    viewMode, setViewMode,
    isOpen, onOpen, onClose,
    unassignedCount,
    empresaParaMostrar,
    filteredGroups, consolidatedItems, countries, clients,
    isLoading: isLoading || !syncReady,
    error,
    selectedGroup
  };
};
