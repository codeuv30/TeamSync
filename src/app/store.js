import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/state/auth/authSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice
    }
});