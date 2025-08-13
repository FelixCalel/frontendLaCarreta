import { useMemo, useState } from "react";
import {
  useGetQaAggregatedQuery,
  useUpdateMuestreoMutation,
} from "../services/qaApi";

export default function useQaIntakeForm(pedidoId) {
  const { data = [], isLoading } = useGetQaAggregatedQuery();
  const [provider, setProvider] = useState(null);
  const [ptmq, setPtmq] = useState(false);
  const [selectedQa, setSelectedQa] = useState(null);
  const [updateMuestreo, { isLoading: savingMuestreo }] =
    useUpdateMuestreoMutation();

  const pedido = useMemo(
    () => data.find((p) => Number(p.pedidoId) === Number(pedidoId)),
    [data, pedidoId]
  );

  const items = pedido?.items ?? [];

  const openMuestreo = (qaId, muestreoId) =>
    setSelectedQa({ qaId, muestreoId });
  const closeMuestreo = () => setSelectedQa(null);

  const onSaveMuestreo = async (id, payload) => {
    await updateMuestreo({ id, data: payload }).unwrap();
    closeMuestreo();
  };

  const onFinalize = async () => {
    alert(
      "Finalizado (demo). Implementa tu lógica de guardado masivo si aplica."
    );
  };

  return {
    isLoading,
    pedido,
    items,
    provider,
    setProvider,
    ptmq,
    setPtmq,
    selectedQa,
    openMuestreo,
    closeMuestreo,
    onSaveMuestreo,
    savingMuestreo,
    onFinalize,
  };
}
