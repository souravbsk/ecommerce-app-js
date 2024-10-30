


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { refreshAccessToken, logout } from './authSlice';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        await mutex.waitForUnlock();

        let result = await fetchBaseQuery({
            baseUrl: 'http://localhost:5000/api/v1',
            prepareHeaders: (headers, { getState }) => {
                const token = getState().auth.accessToken;
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                return headers;
            },
        })(args, api, extraOptions);

        if (result.error && result.error.status === 403) {
            // Lock to prevent multiple refresh requests
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    const refreshResult = await api.dispatch(refreshAccessToken());
                    if (refreshResult.meta.requestStatus === 'fulfilled') {
                        result = await fetchBaseQuery({
                            baseUrl: 'http://localhost:5000/api/v1',
                            prepareHeaders: (headers, { getState }) => {
                                const token = getState().auth.accessToken;
                                if (token) {
                                    headers.set('Authorization', `Bearer ${token}`);
                                }
                                return headers;
                            },
                        })(args, api, extraOptions);
                    } else {
                        api.dispatch(logout());
                    }
                } finally {
                    release();
                }
            } else {
                await mutex.waitForUnlock();
                result = await fetchBaseQuery({
                    baseUrl: 'http://localhost:5000/api/v1',
                    prepareHeaders: (headers, { getState }) => {
                        const token = getState().auth.accessToken;
                        if (token) {
                            headers.set('Authorization', `Bearer ${token}`);
                        }
                        return headers;
                    },
                })(args, api, extraOptions);
            }
        }

        return result;
    },
    endpoints: (builder) => ({
        // Define your endpoints here
    }),
});

export const { useGetUserQuery, useGetProductsQuery } = apiSlice;
______________________________________________



import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const refreshAccessToken = createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:5000/api/v1/auth/refresh-token', { refreshToken });
        const { accessToken } = response.data;

        // Update the stored access token
        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        isAuthenticated: !!localStorage.getItem('accessToken'),
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.isAuthenticated = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
