import React from "react";
import "../routes/dashboard.css";

export default function Settings() {
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
        <button type="submit" className="btn-save">
          Save Changes
        </button>
      </form>
    </section>
  );
}