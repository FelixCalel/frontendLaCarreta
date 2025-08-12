import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { QaPedido, CreateQaDto, UpdateQaDto, AutoSeedResult } from '../models/controlCalidad.ts';

type OkList<T> = { ok: boolean; data: T };
type OkOne<T> = { ok: boolean; data: T };

export const qaApi = createApi({
    reducerPath: 'qaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ['QaPedido'],
    endpoints: (builder) => ({

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
            invalidatesTags: [{ type: 'QaPedido', id: 'LIST' }],
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

    }),
});

export const {
    useGetQaListQuery,
    useGetQaByIdQuery,
    useCreateQaMutation,
    useUpdateQaMutation,
    useDeleteQaMutation,
    useAutoSeedAllQaMutation,
    useAutoSeedOneQaMutation,
} = qaApi;
