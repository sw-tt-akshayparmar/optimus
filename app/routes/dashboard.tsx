import { Outlet, NavLink, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./dashboard.css";

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={`dashboard-sidebar${collapsed ? " collapsed" : ""}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? "☰" : "✕"}
      </button>
      <nav>
        <NavLink to="overview" className="sidebar-link">Overview</NavLink>
        <NavLink to="analytics" className="sidebar-link">Analytics</NavLink>
        <NavLink to="gallery" className="sidebar-link">Gallery</NavLink>
        <NavLink to="settings" className="sidebar-link">Settings</NavLink>
      </nav>
    </aside>
  );
}

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <h1>Optimus Dashboard</h1>
      <div className="dashboard-user">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="user-avatar" />
        <span className="user-name">Akshay Parmar</span>
      </div>
    </header>
  );
}

// Dummy subroutes
function Overview() {
  return (
    <section className="dashboard-section">
      <h2>Overview</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Images</h3>
          <p>128</p>
        </div>
        <div className="dashboard-card">
          <h3>Active Users</h3>
          <p>42</p>
        </div>
        <div className="dashboard-card">
          <h3>Storage Used</h3>
          <p>1.2 GB</p>
        </div>
      </div>
    </section>
  );
}

function Analytics() {
  return (
    <section className="dashboard-section">
      <h2>Analytics</h2>
      <div className="dashboard-analytics">
        <div className="analytics-chart">
          <h4>Views (Last 7 days)</h4>
          <img src="https://quickchart.io/chart?c={type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Views',data:[12,19,3,5,2,3,9]}]}}" alt="Views Chart" />
        </div>
        <div className="analytics-chart">
          <h4>Uploads (Last 7 days)</h4>
          <img src="https://quickchart.io/chart?c={type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Uploads',data:[2,3,20,5,1,4,7]}]}}" alt="Uploads Chart" />
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="dashboard-section">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="gallery-item" key={index}>
            <img src={`https://picsum.photos/200/200?random=${index}`} alt={`Random ${index}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Settings() {
  return (
    <section className="dashboard-section">
      <h2>Settings</h2>
      <form className="settings-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" defaultValue="akshayparmar" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" defaultValue="akshay.parmar@example.com" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" defaultValue="password123" />
        </div>
        <button type="submit" className="btn-save">Save Changes</button>
      </form>
    </section>
  );
}

export default function Dashboard () {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="dashboard-content">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
}