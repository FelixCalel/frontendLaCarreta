import { useMemo, useState, useCallback } from "react";
import {
  useGetQaAgrupadosQuery,
  useUpdateMuestreoMutation,
} from "../../services/controlCalidadAPI";

export default function useQaIntakeForm(pedidoId) {
  const { data = [], isLoading, refetch } = useGetQaAgrupadosQuery();
  const [updateMuestreo, { isLoading: savingMuestreo }] =
    useUpdateMuestreoMutation();

  const pedido = useMemo(
    () => data.find((p) => Number(p.pedidoId) === Number(pedidoId)),
    [data, pedidoId]
  );

  const items = pedido?.items ?? [];
  const [provider, setProvider] = useState(null);
  const [ptmq, setPtmq] = useState(false);
  const [selectedQa, setSelectedQa] = useState(null);

  const selectMuestreo = useCallback((qaId, muestreoId) => {
    setSelectedQa({ qaId, muestreoId });
  }, []);

  const clearSelection = useCallback(() => setSelectedQa(null), []);

  const onSaveMuestreo = useCallback(
    async (muestreoId, form) => {
      const usuarioId = Number(localStorage.getItem("usuarioId") || 0);

      const payload = {
        transporte_inocuidad: !!form.transporte_inocuidad,
        personal_inocuidad: !!form.personal_inocuidad,
        producto_inocuidad: !!form.producto_inocuidad,
        temperatura_transporte: !!form.temperatura_transporte,
        etiquetado: !!form.etiquetado,
        porcentaje: Number(form.porcentaje ?? 0),
        resultado: String(form.resultado ?? ""),
        brix_promedio: Number(form.brix_promedio ?? 0),
        temperatura: String(form.temperatura ?? "-"),
        desicion: String(form.desicion ?? "PENDIENTE"),
        updatedBy: usuarioId || 0,
      };

      await updateMuestreo({ id: Number(muestreoId), data: payload }).unwrap();
      await refetch();
    },
    [updateMuestreo, refetch]
  );

  const onFinalize = useCallback(() => {
    alert(
      "Finalizado (demo). Implementa tu lógica de cierre masivo si aplica."
    );
  }, []);

  return {
    isLoading,
    pedido,
    items,
    provider,
    setProvider,
    ptmq,
    setPtmq,
    selectedQa,
    selectMuestreo,
    clearSelection,
    onSaveMuestreo,
    savingMuestreo,
    onFinalize,
  };
}
