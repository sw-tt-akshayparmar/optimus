import type { Project as ProjectModel } from "~/models/Project.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";

export async function createProject(project: ProjectModel): Promise<ProjectModel> {
  const res = await apiService.post(APIConfig.PROJECTS, project);
  const savedProject: ProjectModel = res.data;
  return savedProject;
}

export async function getAllProjects(): Promise<ProjectModel[]> {
  const res = await apiService.get(APIConfig.PROJECTS);
  const projects: ProjectModel[] = res.data;
  return projects;
}
