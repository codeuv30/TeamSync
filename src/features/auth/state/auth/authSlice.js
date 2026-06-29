import { createSlice } from "@reduxjs/toolkit";
import { currentLoggedIn, loginEmployee } from "./authAction";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    employee: null,
    isLoading: false,
  },
  reducers: {
    addEmployee: (state, action) => {
      state.employee = action.payload;
      state.isLoading = false;
    },
    removeEmployee: (state, action) => {
      state.employee = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.isLoading = false;
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(currentLoggedIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentLoggedIn.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.isLoading = false;
      })
      .addCase(currentLoggedIn.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { addEmployee, removeEmployee } = authSlice.actions;
export default authSlice.reducer;
