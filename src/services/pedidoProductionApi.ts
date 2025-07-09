import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    Metadata,
    PedidoProduccion,
    DetalleProduccion,
    UpdatePedidoDto,
} from '../models/pedidoProduction'

export const pedidoProduccionApi = createApi({
    reducerPath: 'pedidoProduccionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ['PedidoProduccion', 'DetalleProduccion'],
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
                { type: 'PedidoProduccion', id }
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
} = pedidoProduccionApi
