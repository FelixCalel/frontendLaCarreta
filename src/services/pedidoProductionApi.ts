import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    Metadata,
    PedidoProduccion,
    DetalleProduccion,
    UpdatePedidoDto,
    PedidoAgrupado
} from '../models/pedidoProduction'

export const pedidoProduccionApi = createApi({
    reducerPath: 'pedidoProduccionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ['PedidoProduccion', 'DetalleProduccion', 'PedidoAgrupado'],
    endpoints: (builder) => ({
        getPedidoProduccionMetadata: builder.query<Metadata[], void>({
            query: () => '/pedidoProduccion/metadata',
        }),

        getAllPedidosProduccion: builder.query<PedidoProduccion[], void>({
            query: () => '/pedidoProduccion',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'PedidoProduccion' as const,
                            id,
                        })),
                        { type: 'PedidoProduccion', id: 'LIST' },
                    ]
                    : [{ type: 'PedidoProduccion', id: 'LIST' }],
        }),

        getPedidoProduccionById: builder.query<PedidoProduccion, number>({
            query: (id) => `/pedidoProduccion/${id}`,
            providesTags: (_res, _err, id) => [
                { type: 'PedidoProduccion', id },
            ],
        }),

        getDetallesYProduccion: builder.query<DetalleProduccion[], number>({
            query: (id) => `/pedidoProduccion/${id}/detalles`,
            providesTags: (_res, _err, id) => [
                { type: 'DetalleProduccion', id },
            ],
        }),

        updatePedidoProduccion: builder.mutation<
            PedidoProduccion,
            { id: number; data: UpdatePedidoDto }
        >({
            query: ({ id, data }) => ({
                url: `/pedidoProduccion/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_res, _err, { id }) => [
                { type: 'PedidoProduccion', id },
                // invalidamos la lista agrupada por si cambia algo de estado
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

        avanzarEtapa: builder.mutation<
            { message: string },               // respuesta del backend
            { pedidoId: number; usuarioId: number } // cuerpo que enviamos
        >({
            query: (body) => ({
                url: '/lineaTiempo/avanzar-etapa',
                method: 'POST',
                body,
            }),
            // invalidar lo que necesites refrescar:
            invalidatesTags: (_res, _err, { pedidoId }) => [
                { type: 'PedidoAgrupado', id: pedidoId },
                { type: 'PedidoProduccion', id: pedidoId },
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
} = pedidoProduccionApi
