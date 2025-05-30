import type { Route } from "./+types/home";
import "./home.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Optimus Gallery" },
    { name: "description", content: "Welcome to Optimus Gallery Home!" },
  ];
}

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Welcome to Optimus Gallery</h1>
        <p className="home-subtitle">
          Explore a curated collection of beautiful, safe-for-work images.<br />
          Click on <b>Gallery</b> in the navigation to get started!
        </p>
        <a href="/gallery" className="home-cta">View Gallery</a>
      </div>
    </div>
  );
}
