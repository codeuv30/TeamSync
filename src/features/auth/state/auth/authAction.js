import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../../config/axiosInstance";
import { setError } from "./authSlice";
import { addEmployee } from "./authSlice";

export const loginEmployee = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);

      return response.data.data;
    } catch (error) {
      thunkApi.dispatch(setError(error.response.data.message));
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const registerEmployee = createAsyncThunk(
  "auth/register",
  async (credentials, thunkApi) => {
    try {
      const response = await axiosInstance.post("/auth/register", credentials);

      return response.data.data;
    } catch (error) {
      thunkApi.dispatch(setError(error.response.data.message));
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const currentLoggedIn = createAsyncThunk(
  "auth/me",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/auth/me");

      thunkApi.dispatch(addEmployee(response.data.user));

      return response.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);
