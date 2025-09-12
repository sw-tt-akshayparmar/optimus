import Terminal from "~/components/Terminal";

import Projects from "~/components/Projects";
import Files from "~/components/Files";

export default function Workspace() {
  return (
    <div className="bg-surface-card rounded-xl shadow-md px-content py-8 flex flex-col gap-8 w-screen h-screen font-inter">
      <div className="flex flex-col md:flex-row justify-between w-full gap-8">
        <Projects />
        <Files />
      </div>
      <Terminal />
    </div>
  );
}
