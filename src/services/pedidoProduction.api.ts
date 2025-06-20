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
        baseUrl: import.meta.env.VITE_API_URL
    }),
    tagTypes: ['PedidoProduccion'],
    endpoints: (builder) => ({

        // 1) Metadata
        getPedidoProduccionMetadata: builder.query<Metadata[], void>({
            query: () => '/pedidoProduccion/metadata',
        }),

        // 2) Todos los pedidos
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

        // 3) Un pedido por ID
        getPedidoProduccionById: builder.query<PedidoProduccion, number>({
            query: (id) => `/pedidoProduccion/${id}`,
            providesTags: (_res, _err, id) => [{ type: 'PedidoProduccion', id }],
        }),

        // 4) Detalles + producción
        getDetallesYProduccion: builder.query<DetalleProduccion[], number>({
            query: (id) => `/pedidoProduccion/${id}/detalles`,
            providesTags: (result, _err, id) =>
                result
                    ? [
                        ...result.map(({ id_detallePedido }) => ({
                            type: 'PedidoProduccion' as const,
                            id: id_detallePedido,
                        })),
                        { type: 'PedidoProduccion', id: `DETALLES_${id}` },
                    ]
                    : [{ type: 'PedidoProduccion', id: `DETALLES_${id}` }],
        }),

        // 5) Actualizar pedido
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
                { type: 'PedidoProduccion', id: 'LIST' },
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