import type { Project as ProjectModel } from "~/models/Project.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";
import { store } from "~/store/store";
import { setProject, setProjectList } from "~/store/project.slice";
import { enable, disable } from "~/store/loader.slice";
import LoaderActions from "~/enums/loader.enum";

export async function createProject(project: ProjectModel) {
  store.dispatch(enable(LoaderActions.CREATE_PROJECT));
  await apiService.post(APIConfig.PROJECTS, project).finally(() => {
    store.dispatch(disable(LoaderActions.CREATE_PROJECT));
  });
}

export async function fetchAllProjects(options?: { page: number; size: number }) {
  let params = undefined;
  if (options) {
    params = {
      page: String(options.page),
      size: String(options.size),
    };
  }
  store.dispatch(enable(LoaderActions.FETCH_PROJECTS));
  await apiService
    .get(APIConfig.PROJECTS, undefined, params)
    .then(res => {
      const projects: {
        total: number;
        page: number;
        size: number;
        records: Array<ProjectModel>;
      } = res.data;
      store.dispatch(setProjectList(projects));
    })
    .finally(() => {
      store.dispatch(disable(LoaderActions.FETCH_PROJECTS));
    });
}

export async function deleteProject(projectId: string) {
  store.dispatch(enable(LoaderActions.DELETE_PROJECT + projectId));
  await apiService.doDelete(APIConfig.PROJECTS, projectId).finally(() => {
    store.dispatch(disable(LoaderActions.DELETE_PROJECT + projectId));
  });
}
