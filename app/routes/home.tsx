import type { Route } from "./+types/home";
import "./home.css";
import  _6502  from "~/components/_6502";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Optimus Gallery" },
    { name: "description", content: "Welcome to Optimus Gallery Home!" },
  ];
}

export default function Home() {
  return <_6502 />;
}
