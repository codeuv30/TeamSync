import { createSlice } from "@reduxjs/toolkit";
import { currentLoggedIn, loginEmployee, registerEmployee } from "./authAction";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    employee: null,
    isLoading: true,
    error: null,
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
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Login */
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

      /* Register */
      .addCase(registerEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.isLoading = false;
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.isLoading = false;
      })

      /* Currently Logged In */
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

export const { addEmployee, removeEmployee, setError } = authSlice.actions;
export default authSlice.reducer;
