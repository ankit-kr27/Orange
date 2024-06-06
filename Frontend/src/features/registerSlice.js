import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

export const register = createAsyncThunk(
    "register/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `${import.meta.env.VITE_BACKEND_URL}users/register`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState: {
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.status = "loading";
            })
            .addCase(register.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
                    ? action.payload
                    : action.error.message;
            });
    },
});

export default registerSlice.reducer;
