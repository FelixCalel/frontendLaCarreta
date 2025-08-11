// src/services/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // ej: http://localhost:3000/api
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ejemplo: traer permisos/rutas del usuario
    getMyPermissions: builder.query({
      query: () => "auth/me/permissions", // ajusta al endpoint que tengas
    }),
  }),
});

export const { useGetMyPermissionsQuery } = authApi;
