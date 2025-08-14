import { useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  useGetQaAgrupadosQuery,
  useUpdateMuestreoMutation,
  qaApi,
} from "../../services/controlCalidadAPI";

export default function useQaIntakeForm(pedidoId) {
  const dispatch = useDispatch();

  const {
    data = [],
    isLoading,
    refetch,
  } = useGetQaAgrupadosQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

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
    setSelectedQa({ qaId, muestreoId: muestreoId ?? null });
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
        desicion: String(form.desicion ?? ""),
        updatedBy: usuarioId || 0,
      };

      await updateMuestreo({ id: Number(muestreoId), data: payload }).unwrap();

      dispatch(
        qaApi.util.updateQueryData("getQaAgrupados", undefined, (draft) => {
          const group = draft?.find(
            (g) => Number(g.pedidoId) === Number(pedidoId)
          );
          if (!group || !Array.isArray(group.items)) return;

          const it = group.items.find(
            (x) => Number(x.muestreoId) === Number(muestreoId)
          );
          if (it) {
            it.muestreoDecision = payload.desicion;
            it.updatedAt = new Date().toISOString();
          }
        })
      );

      dispatch(
        qaApi.util.invalidateTags([
          { type: "QaGrouped", id: "LIST" },
          { type: "QaPedido", id: "LIST" },
        ])
      );
      await refetch();
    },
    [updateMuestreo, dispatch, refetch, pedidoId]
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
