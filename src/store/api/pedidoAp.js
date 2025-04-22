import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const pedidosApi = createApi({
  reducerPath: "pedidosApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Pedidos"],
  endpoints: (builder) => ({
    getPedidos: builder.query({
      query: () => "/pedidos/todos",
      providesTags: ["Pedidos"],
      pollingInterval: 1_000,
    }),

    addPedido: builder.mutation({
      query: (nuevo) => ({
        url: "/pedidos/create",
        method: "POST",
        body: nuevo,
      }),
      invalidatesTags: ["Pedidos"],
    }),
  }),
});

// **hooks automáticos**
export const { useGetPedidosQuery, useAddPedidoMutation } = pedidosApi;
