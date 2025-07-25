import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
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
} from '../models/pedidoProduction'

export const pedidoProduccionApi = createApi({
    reducerPath: 'pedidoProduccionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ['PedidoProduccion', 'DetalleProduccion', 'PedidoAgrupado', 'RecetaPedido'],
    endpoints: (builder) => ({

        getPedidoProduccionMetadata: builder.query<Metadata[], void>({
            query: () => '/pedidoProduccion/metadata',
        }),

        getAllPedidosProduccion: builder.query<PedidoProduccion[], void>({
            query: () => '/pedidoProduccion',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'PedidoProduccion' as const, id })),
                        { type: 'PedidoProduccion', id: 'LIST' },
                    ]
                    : [{ type: 'PedidoProduccion', id: 'LIST' }],
        }),

        getPedidoProduccionById: builder.query<PedidoProduccion, number>({
            query: (id) => `/pedidoProduccion/${id}`,
            providesTags: (_res, _err, id) => [{ type: 'PedidoProduccion', id }],
        }),

        getDetallesYProduccion: builder.query<DetalleProduccion[], number>({
            query: (id) => `/pedidoProduccion/${id}/detalles`,
            providesTags: (_res, _err, id) => [{ type: 'DetalleProduccion', id }],
        }),
        updatePedidoProduccion: builder.mutation<PedidoProduccion, { id: number; data: UpdatePedidoDto }>({
            query: ({ id, data }) => ({
                url: `/pedidoProduccion/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_res, _err, { id }) => [
                { type: 'PedidoProduccion', id },
                // **muy importante**: invalida la lista de grupos
                { type: 'PedidoAgrupado', id: 'LIST' },
            ],
        }),


        getPedidosAgrupados: builder.query<PedidoAgrupado[], void>({
            query: () => '/pedidoProduccion/agrupados',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ pedidoId }) => ({
                            type: 'PedidoAgrupado' as const,
                            id: pedidoId,
                        })),
                        { type: 'PedidoAgrupado', id: 'LIST' },
                    ]
                    : [{ type: 'PedidoAgrupado', id: 'LIST' }],
        }),

        avanzarEtapa: builder.mutation<{ message: string }, AvanzarEtapaPayload>({
            query: (body) => ({
                url: '/lineaTiempo/avanzar-etapa',
                method: 'POST',
                body,
            }),
            invalidatesTags: (_r, _e, { pedidoId }) => [
                { type: 'PedidoAgrupado', id: pedidoId },
                { type: 'PedidoProduccion', id: pedidoId },
                { type: 'DetalleProduccion', id: pedidoId },
                { type: 'RecetaPedido', id: pedidoId },
            ],
        }),

        avanzarEtapaDetalle: builder.mutation<AvanceOK, AvanzarEtapaDetallePayload>({
            query: (body) => ({
                url: '/lineaTiempoDetalle/avanzar',
                method: 'POST',
                body,
            }),
            invalidatesTags: (_r, _e, { detalleOrdenId }) => [
                { type: 'DetalleProduccion', id: detalleOrdenId },
            ],
        }),

        avanzarMultiEtapaDetalle: builder.mutation<
            AvanceMultiplesOK,
            AvanzarMultiEtapaDetallePayload
        >({
            query: (body) => ({
                url: '/lineaTiempoDetalle/avanzar-multiples',
                method: 'POST',
                body,
            }),
            invalidatesTags: (_r, _e, { detalleOrdenIds }) => [
                ...detalleOrdenIds.map((id) => ({ type: 'DetalleProduccion' as const, id })),
                { type: 'DetalleProduccion', id: 'LIST' },
            ],
        }),

        getRecetaByPedido: builder.query<RecetaLinea[], number>({
            query: (pedidoId) => `/receta/pedido/${pedidoId}`,
            providesTags: (_res, _err, pedidoId) => [
                { type: 'RecetaPedido', id: pedidoId },
            ],
        }),

        updateRecetaLinea: builder.mutation<
            RecetaLinea,
            { id: number; data: UpdateRecetaLineaDto; pedidoId: number }
        >({
            query: ({ id, data }) => ({
                url: `/receta/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_res, _err, { pedidoId, id }) => [
                { type: 'RecetaPedido', id: pedidoId },
                { type: 'RecetaPedido', id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useGetPedidoProduccionMetadataQuery,
    useGetAllPedidosProduccionQuery,
    useGetPedidoProduccionByIdQuery,
    useGetDetallesYProduccionQuery,
    useUpdatePedidoProduccionMutation,
    useGetPedidosAgrupadosQuery,
    useAvanzarEtapaMutation,
    useAvanzarEtapaDetalleMutation,
    useAvanzarMultiEtapaDetalleMutation,
    useGetRecetaByPedidoQuery,
    useUpdateRecetaLineaMutation,
} = pedidoProduccionApi
