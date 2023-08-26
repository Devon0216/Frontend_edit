import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'https://whiteboard-server-7kf51co6i-devon0216.vercel.app/' }),
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})