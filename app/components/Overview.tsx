import React from "react";
import "../routes/dashboard.css";

export default function Overview() {
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