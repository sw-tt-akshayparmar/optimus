import type { Project as ProjectModel } from "~/models/Project.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";
import { store } from "~/store/store";
import { setProjectList } from "~/store/project.slice";
export async function createProject(project: ProjectModel) {
  return apiService.post(APIConfig.PROJECTS, project).finally(() => {});
}

export async function fetchAllProjects(options?: { page: number; size: number }) {
  let params = undefined;
  if (options) {
    params = {
      page: String(options.page),
      size: String(options.size),
    };
  }
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
    .finally(() => {});
}

export async function deleteProject(projectId: string) {
  return apiService.doDelete<ProjectModel>(APIConfig.PROJECTS, projectId);
}
