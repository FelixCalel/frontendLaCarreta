import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Metadata,
  PedidoProduccion,
  DetalleProduccion,
  UpdatePedidoDto,
  PedidoAgrupado,
  AvanzarEtapaPayload,
  AvanceOK,
  AvanzarEtapaDetallePayload,
  AvanceMultiplesOK,
  AvanzarMultiEtapaDetallePayload,
  RecetaLinea,
  UpdateRecetaLineaDto,
  Rechazo,
  CreateRechazoDto,
  UpdateRechazoDto,
  CreateRecetaLineaDto,
} from "../models/pedidoProduction";
import { parseNumericFields } from "../utils/data-parser";

export interface ProdAlmacen {
  id: number | string;
  nombre: string;
}

export interface UnidadMedida {
  id: number;
  unidad: string;
}

export interface MotivoSalida {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const pedidoProduccionApi = createApi({
  reducerPath: "pedidoProduccionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "PedidoProduccion",
    "DetalleProduccion",
    "PedidoAgrupado",
    "RecetaPedido",
    "Rechazo",
    "Almacen",
    "UnidadMedida",
  ],
  endpoints: (builder) => ({
    getAlmacenes: builder.query<ProdAlmacen[], void>({
      query: () => "/almacen",
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Almacen" as const, id })),
            { type: "Almacen", id: "LIST" },
          ]
          : [{ type: "Almacen", id: "LIST" }],
    }),
    getUnidadesMedida: builder.query<{ id: number; unidad: string }[], void>({
      query: () => "/unidadMedida",
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "UnidadMedida" as const, id })),
            { type: "UnidadMedida", id: "LIST" },
          ]
          : [{ type: "UnidadMedida", id: "LIST" }],
    }),
    getPedidoProduccionMetadata: builder.query<Metadata[], void>({
      query: () => "/pedidoProduccion/metadata",
    }),

    getAllPedidosProduccion: builder.query<PedidoProduccion[], void>({
      query: () => "/pedidoProduccion",
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({
              type: "PedidoProduccion" as const,
              id,
            })),
            { type: "PedidoProduccion", id: "LIST" },
          ]
          : [{ type: "PedidoProduccion", id: "LIST" }],
    }),

    getPedidoProduccionById: builder.query<PedidoProduccion, number>({
      query: (id) => `/pedidoProduccion/${id}`,
      providesTags: (_res, _err, id) => [{ type: "PedidoProduccion", id }],
    }),

    getDetallesYProduccion: builder.query<DetalleProduccion[], number>({
      query: (id) => `/pedidoProduccion/${id}/detalles`,
      providesTags: (_res, _err, id) => [{ type: "DetalleProduccion", id }],
    }),
    updatePedidoProduccion: builder.mutation<
      PedidoProduccion,
      { id: number; data: UpdatePedidoDto }
    >({
      query: ({ id, data }) => ({
        url: `/pedidoProduccion/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResults = [{ etapaId: 1 }, { etapaId: 2 }, { etapaId: 3 }].map((arg) =>
          dispatch(
            pedidoProduccionApi.util.updateQueryData(
              "getPedidosAgrupados",
              arg,
              (draft: PedidoAgrupado[]) => {
                for (const group of draft) {
                  const item = group.items.find((i) => i.id === id);
                  if (item) {
                    Object.assign(item, data);
                    break;
                  }
                }
              }
            )
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach(pr => pr.undo());
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "PedidoProduccion" as const, id },
        { type: "PedidoProduccion" as const, id: "LIST" },
      ],
    }),

    updateMultiplePedidosProduccion: builder.mutation<void, { ids: number[]; data: UpdatePedidoDto }>({
      query: ({ ids, data }) => ({
        url: `/pedidoProduccion/multiple`,
        method: "PUT",
        body: { ids, data },
      }),
      async onQueryStarted({ ids, data }, { dispatch, queryFulfilled }) {
        if (data.completo === undefined) return;

        const patchResults = [{ etapaId: 1 }, { etapaId: 2 }, { etapaId: 3 }].map((arg) =>
          dispatch(
            pedidoProduccionApi.util.updateQueryData(
              "getPedidosAgrupados",
              arg,
              (draft: PedidoAgrupado[]) => {
                if (data.completo !== undefined) {
                  draft.forEach(group => {
                    group.items.forEach(item => {
                      if (ids.includes(item.id)) {
                        item.completo = data.completo!;
                      }
                    });
                  });
                }
              }
            )
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach(pr => pr.undo());
        }
      },
      invalidatesTags: [
        { type: "PedidoProduccion", id: "LIST" },
        { type: "PedidoAgrupado", id: "LIST" },
      ],
    }),

    getUnassignedOrders: builder.query<PedidoAgrupado[], void>({
      query: () => "/pedidoProduccion/sin-asignar",
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ pedidoId }) => ({
              type: "PedidoAgrupado" as const,
              id: pedidoId,
            })),
            { type: "PedidoAgrupado", id: "LIST" },
            { type: "PedidoProduccion", id: "LIST" },
          ]
          : [{ type: "PedidoAgrupado", id: "LIST" }, { type: "PedidoProduccion", id: "LIST" }],
    }),

    getMotivosSalida: builder.query<MotivoSalida[], void>({
      query: () => "/motivos-salida",
      transformResponse: (res: { ok: boolean; motivos: MotivoSalida[] }) => res.motivos,
    }),

    getPedidosAgrupados: builder.query<
      PedidoAgrupado[],
      { etapaId?: number; completed?: boolean } | void
    >({
      query: (params) => {
        let url = "/pedidoProduccion/agrupados";
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.etapaId !== undefined) {
            queryParams.append("etapaId", params.etapaId.toString());
          }
          if (params.completed !== undefined) {
            queryParams.append("completed", params.completed.toString());
          }
          const queryString = queryParams.toString();
          if (queryString) {
            url += `?${queryString}`;
          }
        }
        return url;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ pedidoId }) => ({
              type: "PedidoAgrupado" as const,
              id: pedidoId,
            })),
            { type: "PedidoAgrupado", id: "LIST" },
          ]
          : [{ type: "PedidoAgrupado", id: "LIST" }],
      transformResponse: (response: PedidoAgrupado[]) => {
        return response.map((agrupado) => ({
          ...agrupado,
          items: agrupado.items.map(parseNumericFields),
        }));
      },
    }),

    avanzarEtapa: builder.mutation<{ message: string }, AvanzarEtapaPayload>({
      query: (body) => ({
        url: "/lineaTiempo/avanzar-etapa",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { pedidoId }) => [
        { type: "PedidoAgrupado", id: pedidoId },
        { type: "PedidoProduccion", id: pedidoId },
        { type: "DetalleProduccion", id: pedidoId },
        { type: "RecetaPedido", id: pedidoId },
      ],
    }),

    avanzarEtapaDetalle: builder.mutation<AvanceOK, AvanzarEtapaDetallePayload>(
      {
        query: (body) => ({
          url: "/lineaTiempoDetalle/avanzar",
          method: "POST",
          body,
        }),
        invalidatesTags: (_r, _e, { detalleOrdenId }) => [
          { type: "DetalleProduccion", id: detalleOrdenId },
          { type: "PedidoAgrupado", id: "LIST" },
        ],
      }
    ),

    avanzarMultiEtapaDetalle: builder.mutation<
      AvanceMultiplesOK,
      AvanzarMultiEtapaDetallePayload
    >({
      query: (body) => ({
        url: "/lineaTiempoDetalle/avanzar-multiples",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { detalleOrdenIds }) => [
        ...detalleOrdenIds.map((id) => ({
          type: "DetalleProduccion" as const,
          id,
        })),
        { type: "DetalleProduccion", id: "LIST" },
        { type: "PedidoAgrupado", id: "LIST" },
      ],
    }),



    createRecetaLinea: builder.mutation<
      RecetaLinea,
      { data: CreateRecetaLineaDto }
    >({
      query: ({ data }) => ({
        url: "/receta",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_res, _err, { data }) => [
        { type: "RecetaPedido", id: data.pedido_produccionid },
        { type: "RecetaPedido", id: "LIST" },
      ],
    }),

    getItems: builder.query<
      { items: any[]; totalItems: number },
      { page: number; pageSize: number; nombre?: string; codigo?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("page", params.page.toString());
        queryParams.append("pageSize", params.pageSize.toString());
        if (params.nombre) queryParams.append("nombre", params.nombre);
        if (params.codigo) queryParams.append("codigo", params.codigo);
        return `/items/todos?${queryParams.toString()}`;
      },
    }),

    getStockSAP: builder.query<
      any,
      { itemcode: string; pedidoId: number }
    >({
      query: (body) => ({
        url: "/sap/items/stock",
        method: "POST",
        body,
      }),
    }),

    getRecetaByPedido: builder.query<RecetaLinea[], { pedidoId: number; id_almacen?: number }>({
      query: ({ pedidoId, id_almacen }) => {
        let url = `/receta/pedido/${pedidoId}`;
        if (id_almacen) {
          url += `?id_almacen=${id_almacen}`;
        }
        return url;
      },
      providesTags: (_res, _err, { pedidoId }) => [
        { type: "RecetaPedido", id: pedidoId },
      ],
    }),

    updateRecetaLinea: builder.mutation<
      RecetaLinea,
      { id: number; data: UpdateRecetaLineaDto; pedidoId: number }
    >({
      query: ({ id, data }) => ({
        url: `/receta/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { pedidoId, id }) => [
        { type: "RecetaPedido", id: pedidoId },
        { type: "RecetaPedido", id: "LIST" },
      ],
    }),

    procesarEstado5: builder.mutation<
      { procesados: number; errores: string[] },
      void
    >({
      query: () => ({
        url: "/lineaTiempo/procesar-estado5",
        method: "POST",
        body: {},
      }),
      invalidatesTags: [{ type: "PedidoAgrupado", id: "LIST" }],
    }),

    getRechazos: builder.query<Rechazo[], void>({
      query: () => "/rechazo",
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Rechazo" as const, id })),
            { type: "Rechazo", id: "LIST" },
          ]
          : [{ type: "Rechazo", id: "LIST" }],
    }),

    getRechazoById: builder.query<Rechazo, number>({
      query: (id) => `/rechazo/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Rechazo", id }],
    }),

    createRechazo: builder.mutation<Rechazo, CreateRechazoDto>({
      query: (data) => ({
        url: "/rechazo",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id_pedidoProd }) => [
        { type: "Rechazo", id: "LIST" },
        { type: "PedidoProduccion", id: "LIST" },
        { type: "PedidoProduccion", id: id_pedidoProd },
        { type: "PedidoAgrupado", id: "LIST" },
      ],
    }),

    updateRechazo: builder.mutation<
      Rechazo,
      { id: number; data: UpdateRechazoDto; id_pedidoProd: number }
    >({
      query: ({ id, data }) => ({
        url: `/rechazo/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id, id_pedidoProd }) => [
        { type: "Rechazo", id },
        { type: "PedidoProduccion", id: id_pedidoProd },
        { type: "PedidoAgrupado", id: "LIST" },
        { type: "Rechazo", id: "LIST" },
      ],
    }),

    getRechazoByPedidoProduccionId: builder.query<Rechazo, number>({
      query: (id) => `/pedidoProduccion/${id}/rechazo`,
      providesTags: (result, error, id) =>
        result
          ? [
            { type: "Rechazo", id: result.id },
            { type: "PedidoProduccion", id },
          ]
          : [{ type: "PedidoProduccion", id }],
    }),
  }),
});

export const {
  useGetPedidoProduccionMetadataQuery,
  useGetAllPedidosProduccionQuery,
  useGetPedidoProduccionByIdQuery,
  useGetDetallesYProduccionQuery,
  useUpdatePedidoProduccionMutation,
  useGetPedidosAgrupadosQuery,
  useGetUnassignedOrdersQuery,
  useAvanzarEtapaMutation,
  useAvanzarEtapaDetalleMutation,
  useAvanzarMultiEtapaDetalleMutation,
  useGetRecetaByPedidoQuery,
  useUpdateRecetaLineaMutation,
  useProcesarEstado5Mutation,
  useGetRechazosQuery,
  useGetRechazoByIdQuery,
  useCreateRechazoMutation,
  useUpdateRechazoMutation,
  useGetRechazoByPedidoProduccionIdQuery,
  useUpdateMultiplePedidosProduccionMutation,
  useGetAlmacenesQuery,
  useGetUnidadesMedidaQuery,
  useCreateRecetaLineaMutation,
  useLazyGetItemsQuery,
  useLazyGetStockSAPQuery,
  useGetMotivosSalidaQuery,
} = pedidoProduccionApi;
