import Terminal from "~/components/Terminal";
import "./workspace.css";
import Projects from "~/components/Projects";
import Files from "~/components/Files";

export default function Workspace() {
  return (
    <div className="workspace flex">
      <div className="project-area flex">
        <Projects />
        <Files />
      </div>
      <Terminal />
    </div>
  );
}
