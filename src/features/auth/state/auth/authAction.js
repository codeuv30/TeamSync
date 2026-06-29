import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../../config/axiosInstance"

export const loginEmployee = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
        const response = await axiosInstance.post("/auth/login", credentials);

        return response.data.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error);
    }
  },
);

export const currentLoggedIn = createAsyncThunk(
  "auth/me",
  async (_, thunkApi) => {
    try {
        const response = await axiosInstance.get("/auth/me");

        return response.data.user;
    } catch (error) {
        return thunkApi.rejectWithValue(error);
    }
  }
)