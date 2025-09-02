import { useEffect, useState } from "react";
import { DataView } from "primereact/dataview";
import { Project as ProjectModel } from "../models/Project.model";
import * as userService from "../services/user.service";
import * as projectService from "../services/project.service";
import "./projects.css";

export default function Projects() {
  const [projects, setProjects] = useState<Array<ProjectModel>>([]);
  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    }
    fetchProjects();
  }, []);

  const createProject = () => {
    if (!newProject.trim()) return;
    const newItem = ProjectModel.from({
      id: crypto.randomUUID(),
      name: newProject,
      description: "No description yet",
      userId: userService.getUserData().id!,
    });
    setProjects([newItem, ...projects]);
    setNewProject("");
    // TODO: POST to API
  };

  const projectTemplate = (project: ProjectModel) => {
    return (
      <div className="project-card card p-md m-sm flex flex-col gap-sm">
        <h3 className="text-accent">{project.name}</h3>
        <p className="text-secondary">{project.description}</p>
      </div>
    );
  };

  return (
    <div className="projects-wrapper flex flex-col gap-md">
      <div className="project-actions flex gap-sm">
        <input
          type="text"
          className="project-input p-sm"
          placeholder="New project name..."
          value={newProject}
          onChange={e => setNewProject(e.target.value)}
        />
        <button
          className="project-create-btn p-sm"
          onClick={createProject}
          disabled={!newProject.trim()}
        >
          Create Project
        </button>
      </div>

      <DataView
        value={projects}
        itemTemplate={projectTemplate}
        paginator
        rows={5}
        loading={loading}
        className="project-items"
      />
    </div>
  );
}
