import {createSlice} from "@reduxjs/toolkit";

const loginModalsSlice = createSlice({
    name: "loginModal",
    initialState: {
        isOpen: false,
        type: "login",
    },
    reducers: {
        openLoginModal: (state) => {
            state.isOpen = true;
            state.type = "login";
        },
        openRegisterModal: (state) => {
            state.isOpen = true;
            state.type = "register";
        },
        closeLoginModal: (state) => {
            state.isOpen = false;
        },
    },
});

export const {openLoginModal, openRegisterModal, closeLoginModal} =
    loginModalsSlice.actions;

export default loginModalsSlice.reducer;