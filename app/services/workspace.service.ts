import type { Project as ProjectModel } from "~/models/Project.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";

export async function createProject(project: ProjectModel): Promise<ProjectModel> {
  const res = await apiService.post(APIConfig.PROJECTS, project);
  const savedProject: ProjectModel = res.data;
  return savedProject;
}

export async function getAllProjects(options?: { page: number; size: number }): Promise<{
  total: number;
  page: number;
  size: number;
  records: Array<ProjectModel>;
}> {
  let params = undefined;
  if (options) {
    params = {
      page: String(options.page),
      size: String(options.size),
    };
  }
  const res = await apiService.get(APIConfig.PROJECTS, params);
  const projects: {
    total: number;
    page: number;
    size: number;
    records: Array<ProjectModel>;
  } = res.data;
  return projects;
}
