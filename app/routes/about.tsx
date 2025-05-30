import "./about.css"

export default function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">About Optimus Gallery</h1>
        <p className="about-desc">
          Optimus Gallery is a modern, full-stack React application designed to
          showcase beautiful, safe-for-work images with a seamless and elegant
          user experience.
        </p>
        <div className="about-section">
          <h2>Features</h2>
          <ul>
            <li>✨ Curated SFW image gallery</li>
            <li>📊 Interactive dashboard with analytics</li>
            <li>🗺️ Map, monitor, and weather integrations</li>
            <li>⚡ Built with React Router, TypeScript, and Tailwind CSS</li>
          </ul>
        </div>
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            To provide a delightful and productive gallery experience for
            everyone, with a focus on usability, accessibility, and modern design.
          </p>
        </div>
        <div className="about-footer">
          <span>Made with ❤️ by Akshay Parmar</span>
        </div>
      </div>
    </div>
  );
}