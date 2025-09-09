import { createSlice } from "@reduxjs/toolkit";
import { Project as ProjectModel } from "~/models/Project.model";

export interface ProjectStore {
  project: ProjectModel | null;
  projectList: {
    total: number;
    page: number;
    size: number;
    records: Array<ProjectModel>;
  };
}
const initialState: ProjectStore = {
  project: null,
  projectList: {
    total: 0,
    page: 0,
    size: 0,
    records: [],
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: function (state, action) {
      state.project = action.payload;
    },

    setProjectList: function (state, action) {
      state.projectList = action.payload;
    },
  },
});

export const { setProject, setProjectList } = projectSlice.actions;
export default projectSlice.reducer;
