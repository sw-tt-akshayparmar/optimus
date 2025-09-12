import { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { Project as ProjectModel } from "../models/Project.model";
import * as userService from "../services/user.service";
import * as workspaceService from "../services/workspace.service";
import type { ProjectStore } from "~/store/project.slice";
import { useSelector } from "react-redux";
import LoaderActions from "~/enums/loader.enum";
import { Exception } from "~/exception/app.exception";
import { disable, enable } from "~/services/loader.service";
import { useToast } from "./ToastContext";
import { InputText } from "primereact/inputtext";

export default function Projects() {
  const projects = useSelector<{ projects: ProjectStore }, ProjectStore>(state => state.projects);
  const loaders = useSelector<{ loaders: any }, any>(state => state.loaders.loaders);
  const [newProject, setNewProject] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const toast = useToast();
  const pageInit = {
    size: 3,
    page: 1,
  };
  const fetchProjectList = async (page: { page: number; size: number }) => {
    enable(LoaderActions.FETCH_PROJECTS);
    await workspaceService
      .fetchAllProjects({ page: page.page, size: page.size })
      .catch(err => {
        toast.error(err.message, "Error Fetching Projects");
      })
      .finally(() => {
        disable(LoaderActions.FETCH_PROJECTS);
      });
  };

  useEffect(() => {
    fetchProjectList(pageInit);
  }, []);

  const createProject = async () => {
    if (!newProject.trim()) return;
    const project = ProjectModel.from({
      name: newProject,
      description: projectDescription,
      userId: userService.getUserData().id!,
    });
    setNewProject("");
    setProjectDescription("");
    enable(LoaderActions.CREATE_PROJECT);
    await workspaceService
      .createProject(project)
      .then(async res => {
        toast.success(`${project.name}`, res.success || "Project Cretaed Successfully");
        fetchProjectList(projects.projectList);
      })
      .catch((err: Exception) => {
        toast.error(`${project.name}`, err.message || "Project Creation Failed");
      })
      .finally(() => {
        disable(LoaderActions.CREATE_PROJECT);
      });
  };

  const projectTemplate = (project: ProjectModel) => {
    return (
      <div
        key={crypto.randomUUID()}
        className="flex justify-between items-center rounded shadow-card bg-bg p-md mb-sm"
      >
        <img src={project.icon} alt="Project" className="ml-6 w-[50px] h-[50px] rounded-full" />
        <div className="flex flex-col gap-2 w-[calc(100%-80px)] p-4 m-2">
          <h3 className="text-accent text-lg font-semibold">
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
              }}
              className="hover:underline"
            >
              {project.name}
            </a>
          </h3>
          <p className="text-secondary text-sm opacity-80">{project.description}</p>
        </div>
        <div>
          <Button
            label="Delete"
            severity="danger"
            icon="pi pi-trash"
            loading={loaders[LoaderActions.DELETE_PROJECT + project.id]}
            onClick={async () => {
              try {
                enable(LoaderActions.DELETE_PROJECT + project.id);
                const res = await workspaceService.deleteProject(project.id!);
                toast.success(`${project.name}`, res.success || "Project Deleted");
                fetchProjectList(projects.projectList);
              } catch (err: Exception | Error | any) {
                toast.error(`${project.name}`, err.message || "Project Deletion Failed");
              } finally {
                disable(LoaderActions.DELETE_PROJECT + project.id);
              }
            }}
          />
        </div>
      </div>
    );
  };
  const skeltonTemplate = (count = 3) => {
    return "_"
      .repeat(count)
      .split("")
      .map(() => {
        return (
          <div
            key={crypto.randomUUID()}
            className="flex justify-between items-center rounded shadow-card bg-bg p-md mb-sm"
          >
            <Skeleton shape="circle" size="50px" className="ml-6 w-[50px] h-[50px] rounded-full" />
            <div className="flex flex-col gap-2 w-[calc(100%-80px)] p-4 m-2">
              <Skeleton className="text-accent text-lg font-semibold" />
              <Skeleton className="text-secondary text-sm opacity-80" />
            </div>
          </div>
        );
      });
  };

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <InputText
          type="text"
          id="projectName"
          placeholder="New project name..."
          value={newProject}
          onChange={e => setNewProject(e.target.value)}
        />
        <InputText
          type="text"
          id="projectDescription"
          placeholder="Project Description (optional)"
          value={projectDescription}
          onChange={e => setProjectDescription(e.target.value)}
        />
        <Button
          icon="pi pi-plus"
          onClick={createProject}
          disabled={!newProject.trim()}
          loading={loaders[LoaderActions.CREATE_PROJECT]}
          label="Create Project"
        />
      </div>
      <div className="max-h-[480px] overflow-y-scroll scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div>
          {loaders[LoaderActions.FETCH_PROJECTS]
            ? skeltonTemplate()
            : projects.projectList.records.map((project: ProjectModel) => {
                return projectTemplate(project);
              })}
        </div>
        <Paginator
          first={(projects.projectList.page - 1) * projects.projectList.size}
          rows={projects.projectList.size}
          totalRecords={projects.projectList.total}
          rowsPerPageOptions={[2, 3, 5]}
          onPageChange={page => {
            fetchProjectList({
              page: page.page + 1,
              size: page.rows,
            });
          }}
        />
      </div>
    </div>
  );
}
