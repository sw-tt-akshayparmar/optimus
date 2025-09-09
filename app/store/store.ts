import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "~/store/project.slice";
import loaderSlice from "~/store/loader.slice";

export const store = configureStore({
  reducer: {
    projects: projectSlice,
    loaders: loaderSlice,
  },
});
