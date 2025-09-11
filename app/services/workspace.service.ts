import type { Project as ProjectModel } from "~/models/Project.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";
import { store } from "~/store/store";
import { setProjectList } from "~/store/project.slice";
import { enable, disable } from "~/services/loader.service";
import LoaderActions from "~/enums/loader.enum";
import type { SuccessResponse } from "~/models/Response.model";

export async function createProject(project: ProjectModel) {
  enable(LoaderActions.CREATE_PROJECT);
  await apiService.post(APIConfig.PROJECTS, project).finally(() => {
    disable(LoaderActions.CREATE_PROJECT);
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
  enable(LoaderActions.DELETE_PROJECT + projectId);
  await apiService
    .doDelete(APIConfig.PROJECTS, projectId)
    .then((res: SuccessResponse) => {})
    .finally(() => {
      disable(LoaderActions.DELETE_PROJECT + projectId);
    });
}
