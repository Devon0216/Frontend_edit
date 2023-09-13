import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a the server URL and expected endpoints
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'https://whiteboarddj-server.onrender.com' }),
    tagTypes: [],
    endpoints: builder => ({})
})