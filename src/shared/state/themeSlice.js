import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: localStorage.getItem("theme") || "dark",
  },
  reducers: {
    toogleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.mode);

      document.body.classList.remove("dark", "light");

      if (!document.body.classList.contains(state.mode)) {
        document.body.classList.add(state.mode);
      }
    },
  },
});

export const { toogleTheme } = themeSlice.actions;
export default themeSlice.reducer;
