import { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Project as ProjectModel } from "../models/Project.model";
import * as userService from "../services/user.service";
import * as workspaceService from "../services/workspace.service";
import "./projects.css";

export default function Projects() {
  const [projects, setProjects] = useState<Array<ProjectModel>>([]);
  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

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
      <div className="project">
        <img src="https://cdn-icons-png.flaticon.com/256/4599/4599840.png" alt="Project" />
        <div className="project-details p-md m-sm flex flex-col gap-sm">
          <h3 className="text-accent">
            <a href="javascript:void(0);" onClick={() => {}}>
              {project.name}
            </a>
          </h3>
          <p className="text-secondary">{project.description}</p>
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
          <div className="project">
            <Skeleton shape="circle" size="50px" className="ml-4" />
            <div className="project-details p-md m-sm flex flex-col gap-sm">
              <Skeleton className="text-accent" />
              <Skeleton className="text-secondary" />
            </div>
          </div>
        );
      });
  };

  return (
    <div className="projects-wrapper flex flex-col gap-md">
      <div className="project-actions flex gap-sm">
        <input
          type="text"
          id="projectName"
          className="project-input p-sm"
          placeholder="New project name..."
          value={newProject}
          onChange={e => setNewProject(e.target.value)}
        />
        <input
          type="text"
          id="projectDescription"
          className="project-input"
          placeholder="Project Descrition (optional)"
          value={projectDescription}
          onChange={e => setProjectDescription(e.target.value)}
        />
        <button
          className="project-create-btn p-sm"
          onClick={createProject}
          disabled={!newProject.trim()}
        >
          Create Project
        </button>
      </div>
      <div className="project-list">
        {loading
          ? skeltonTemplate()
          : projects.map(project => {
              return projectTemplate(project);
            })}
      </div>
    </div>
  );
}
