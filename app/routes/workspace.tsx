import Terminal from "~/components/Terminal";

import Projects from "~/components/Projects";
import Files from "~/components/Files";

export default function Workspace() {
  return (
    <div className="bg-card rounded-2xl shadow-nav p-8 flex flex-col gap-8 w-screen h-screen">
      <div className="flex justify-between w-full">
        <Projects />
        <Files />
      </div>
      <Terminal />
    </div>
  );
}
