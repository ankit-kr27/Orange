import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

export const login = createAsyncThunk("auth/login", async (data ,{rejectWithValue}) => {
    try{
        const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}users/login`,
        data
    );
    return response.data;
    }catch(error){
        console.log(error)
        if(error.response && error.response.data){
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
    }
});

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, {rejectWithValue}) => {
    try{
        const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}users/refresh-token`
        );
        return response.data;
    }catch(error){
        if(error.response && error.response.data){
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        accessToken: null,
        status: "idle",
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.data.user;
                state.accessToken = action.payload.data.accessToken;
                state.isAuthenticated = true;
                console.log(action.payload)
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ? action.payload : action.error.message;
                state.isAuthenticated = false;
            })
            .addCase(refreshToken.pending, (state) => {
                state.status = "loading";
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.accessToken = action.payload.data.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ? action.payload : action.error.message;
                state.isAuthenticated = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
