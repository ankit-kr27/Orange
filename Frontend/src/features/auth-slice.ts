import axiosInstance from "@/utils/axios/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export interface AuthState {
    user: object | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/login",
    async (
        formData: { email?: string; username?: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post(
                "api/v1/users/login",
                formData
            );
            return response.data;
        } catch (error: unknown) {
            // Check if the error is an AxiosError
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data.message);
            }
            // Handle other types of errors if necessary
            return rejectWithValue(
                "An unknown error occurred while logging in"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post("api/v1/users/logout");
            return {};
        } catch (error) {
            // Check if the error is an AxiosError
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data.message);
            }
            // Handle other types of errors if necessary
            return rejectWithValue("An unknown error occurred while logging out");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default authSlice.reducer;
