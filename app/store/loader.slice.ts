import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loaders: {},
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    enable: function (state, action) {
      const loaders: any = state.loaders;
      loaders[action.payload] = true;
    },

    disable: function (state, action) {
      const loaders: any = state.loaders;
      loaders[action.payload] = false;
    },
  },
});

export const { enable, disable } = loaderSlice.actions;
export default loaderSlice.reducer;
