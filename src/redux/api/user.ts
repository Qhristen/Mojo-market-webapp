import { User } from "@/generated/prisma";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Stats = {
  totalEarnings: number;
  totalSales: number;
  scope: string
  promptsListed: {
    active: number;
    inactive: number;
    total: number;
  };
  totalUsers: number;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/user",
      providesTags: ["User"],
      transformResponse: (response: User[], meta, arg) => response,
      transformErrorResponse: (error: any) => error,
    }),
    getUser: builder.query<User, { id: string }>({
      query: ({ id }) => `/user/${id}`,
      transformResponse: (response: User, meta, arg) => response,
      transformErrorResponse: (error: any) => error,
      providesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    getStats: builder.query<Stats, { userId: string }>({
      query: ({ userId }) => `/user/stats?userId=${userId}`,
      transformResponse: (response: Stats, meta, arg) => response,
      transformErrorResponse: (error: any) => error,
      providesTags: (result, error, { userId }) => [{ type: "User", userId }],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetStatsQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
