import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './api/apiSlice';

// Create a Redux store instance to hold all the states of the application
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})