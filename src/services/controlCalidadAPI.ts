import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    QaPedido,
    CreateQaDto,
    UpdateQaDto,
    AutoSeedResult,
    Muestreo,
    UpdateMuestreoDto,
    QaAgrupadoPorPedido,
    GetQaGroupedParams
} from '../models/controlCalidad';

type OkList<T> = { ok: boolean; data: T };
type OkOne<T> = { ok: boolean; data: T };

export const qaApi = createApi({
    reducerPath: 'qaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ['QaPedido', 'Muestreo', 'QaGrouped'],
    endpoints: (builder) => ({

        getQaAgrupados: builder.query<QaAgrupadoPorPedido[], GetQaGroupedParams | void>({
            query: (params) => ({
                url: '/qa/agrupados',
                params: {
                    includeLote: params?.includeLote,
                    includeProveedor: params?.includeProveedor,
                    proveedorId: params?.proveedorId,
                    loteId: params?.loteId,
                },
            }),
            transformResponse: (resp: unknown) => {
                if (Array.isArray(resp)) {
                    return resp as QaAgrupadoPorPedido[];
                }
                const r = resp as OkList<QaAgrupadoPorPedido[]>;
                return r.data ?? [];
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(g => ({ type: 'QaGrouped' as const, id: g.pedidoId })),
                        { type: 'QaGrouped', id: 'LIST' },
                    ]
                    : [{ type: 'QaGrouped', id: 'LIST' }],
        }),

        getQaList: builder.query<QaPedido[], void>({
            query: () => '/qa',
            transformResponse: (resp: OkList<QaPedido[]>) => resp.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'QaPedido' as const, id })),
                        { type: 'QaPedido', id: 'LIST' },
                    ]
                    : [{ type: 'QaPedido', id: 'LIST' }],
        }),

        getQaById: builder.query<QaPedido, number>({
            query: (id) => `/qa/${id}`,
            transformResponse: (resp: OkOne<QaPedido>) => resp.data,
            providesTags: (_res, _err, id) => [{ type: 'QaPedido', id }],
        }),

        createQa: builder.mutation<QaPedido, CreateQaDto>({
            query: (body) => ({
                url: '/qa',
                method: 'POST',
                body,
            }),
            transformResponse: (resp: OkOne<QaPedido>) => resp.data,
            invalidatesTags: [
                { type: 'QaPedido', id: 'LIST' },
                { type: 'QaGrouped', id: 'LIST' },],
        }),

        updateQa: builder.mutation<QaPedido, { id: number; data: UpdateQaDto }>({
            query: ({ id, data }) => ({
                url: `/qa/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (resp: OkOne<QaPedido>) => resp.data,
            invalidatesTags: (_res, _err, { id }) => [
                { type: 'QaPedido', id },
                { type: 'QaPedido', id: 'LIST' },
                { type: 'QaGrouped', id: 'LIST' },
            ],
        }),

        deleteQa: builder.mutation<QaPedido, { id: number; usuarioId: number }>({
            query: ({ id, usuarioId }) => ({
                url: `/qa/${id}`,
                method: 'DELETE',
                body: { usuarioId },
            }),
            transformResponse: (resp: OkOne<QaPedido>) => resp.data,
            invalidatesTags: (_res, _err, { id }) => [
                { type: 'QaPedido', id },
                { type: 'QaPedido', id: 'LIST' },
                { type: 'QaGrouped', id: 'LIST' },
            ],
        }),

        autoSeedAllQa: builder.mutation<AutoSeedResult, { usuarioId?: number } | void>({
            query: (body) => ({
                url: '/qa/auto',
                method: 'POST',
                body: body ?? {},
            }),
            invalidatesTags: [{ type: 'QaPedido', id: 'LIST' }],
        }),

        autoSeedOneQa: builder.mutation<AutoSeedResult, { produccionId: number; usuarioId?: number }>({
            query: ({ produccionId, usuarioId }) => ({
                url: `/qa/auto/${produccionId}`,
                method: 'POST',
                body: usuarioId ? { usuarioId } : {},
            }),
            invalidatesTags: [{ type: 'QaPedido', id: 'LIST' }],
        }),

        getMuestreoById: builder.query<Muestreo, number>({
            query: (id) => `/muestreo/${id}`,
            transformResponse: (resp: OkOne<Muestreo>) => resp.data,
            providesTags: (_res, _err, id) => [{ type: 'Muestreo', id }],
        }),

        updateMuestreo: builder.mutation<Muestreo, { id: number; data: UpdateMuestreoDto }>({
            query: ({ id, data }) => ({
                url: `/muestreo/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (resp: OkOne<Muestreo>) => resp.data,
            invalidatesTags: (_res, _err, { id }) => [
                { type: 'Muestreo', id },
                { type: 'QaGrouped', id: 'LIST' },
                { type: 'QaPedido', id: 'LIST' },

            ],
        }),

    }),
});

export const {
    useGetQaAgrupadosQuery,
    useGetQaListQuery,
    useGetQaByIdQuery,
    useCreateQaMutation,
    useUpdateQaMutation,
    useDeleteQaMutation,
    useAutoSeedAllQaMutation,
    useAutoSeedOneQaMutation,
    useGetMuestreoByIdQuery,
    useUpdateMuestreoMutation,
} = qaApi;
