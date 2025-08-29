import "./projects.css";
export default function Projects() {
  return (
    <div className="project-list flex">
      <input
        type="text"
        className="project-input"
        placeholder="New project name..."
      />
      <button className="project-create-btn">Create Project</button>
      <ul className="project-items"></ul>
    </div>
  );
}
