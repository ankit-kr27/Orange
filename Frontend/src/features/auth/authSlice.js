import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../lib/api';
import { navigate } from '../../lib/navigation';

const initialState = {
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const response = await authService.login(userData);
            console.log(response.data);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

// Get current user
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, thunkAPI) => {
        try {
            const response = await authService.getCurrentUser();
            console.log(response.data);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                const redirectUrl = location.state?.redirectUrl || '/';
                navigate(redirectUrl, {
                    replace: true,
                });
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Logout cases
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            // Get current user cases
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
