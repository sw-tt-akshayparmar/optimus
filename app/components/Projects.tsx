import { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";
import { Project as ProjectModel } from "../models/Project.model";
import * as userService from "../services/user.service";
import * as workspaceService from "../services/workspace.service";

export default function Projects() {
  const [projects, setProjects] = useState<Array<ProjectModel>>([]);
  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [page, setPage] = useState({});

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const data = await workspaceService.getAllProjects();
      setLoading(false);
      setProjects(data);
    }
    fetchProjects();
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
    setLoading(true);
    const saved: ProjectModel = await workspaceService.createProject(project);
    setLoading(false);
    setProjects([saved, ...projects]);
  };

  const projectTemplate = (project: ProjectModel) => {
    return (
      <div className="flex justify-between items-center rounded shadow-card bg-bg p-md mb-sm">
        <img
          src="https://cdn-icons-png.flaticon.com/256/4599/4599840.png"
          alt="Project"
          className="ml-6 w-[50px] h-[50px] rounded-full"
        />
        <div className="flex flex-col gap-2 w-[calc(100%-80px)] p-4 m-2">
          <h3 className="text-accent text-lg font-semibold">
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                console.log("this");
              }}
              className="hover:underline"
            >
              {project.name}
            </a>
          </h3>
          <p className="text-secondary text-sm opacity-80">{project.description}</p>
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
          <div className="flex justify-between items-center rounded shadow-card bg-bg p-md mb-sm">
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
        <input
          type="text"
          id="projectName"
          className="flex-1 border border-secondary p-3 rounded focus:border-primary transition-colors"
          placeholder="New project name..."
          value={newProject}
          onChange={e => setNewProject(e.target.value)}
        />
        <input
          type="text"
          id="projectDescription"
          className="flex-1 border border-secondary p-3 rounded focus:border-primary transition-colors"
          placeholder="Project Description (optional)"
          value={projectDescription}
          onChange={e => setProjectDescription(e.target.value)}
        />
        <button
          className="bg-primary text-white border-none cursor-pointer px-4 py-3 rounded font-semibold transition-colors hover:bg-accent disabled:bg-secondary disabled:cursor-not-allowed"
          onClick={createProject}
          disabled={!newProject.trim()}
        >
          Create Project
        </button>
      </div>
      <div className="max-h-[480px] overflow-y-scroll scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div>
          {loading
            ? skeltonTemplate()
            : projects.map(project => {
                return projectTemplate(project);
              })}
        </div>
        <Paginator
          first={0}
          rows={20}
          totalRecords={46}
          rowsPerPageOptions={[2, 3, 5]}
          onPageChange={e => {
            console.log(e);
          }}
        />
      </div>
    </div>
  );
}
