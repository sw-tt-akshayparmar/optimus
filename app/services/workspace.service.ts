import type { Project as ProjectModel } from "~/models/Project.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";
import type { SuccessResponse } from "~/models/Response.model";

export async function createProject(project: ProjectModel): Promise<ProjectModel> {
  const res: SuccessResponse<ProjectModel> = await apiService.post(APIConfig.PROJECTS, project);
  const savedProject: ProjectModel = res.data;
  return savedProject;
}

export async function getAllProjects(): Promise<ProjectModel[]> {
  const res: SuccessResponse<ProjectModel[]> = await apiService.get(APIConfig.PROJECTS);
  const projects: ProjectModel[] = res.data;
  return projects;
}
