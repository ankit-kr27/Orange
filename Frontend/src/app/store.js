import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/authSlice.js";
import loginModalReducer from "../features/loginModalSlice.js";
import registerReducer from "../features/registerSlice.js"

const store = configureStore({
    reducer: {
        auth: authReducer,
        loginModal: loginModalReducer,
        register: registerReducer
    }
});

export default store;