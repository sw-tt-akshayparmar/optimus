export default function Monitor() {
  return (
    <section className="dashboard-section">
      <h2>Monitor</h2>
      <div style={{display: "flex", gap: 32, marginTop: 32, flexWrap: "wrap"}}>
        <div style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 8px #0001",
          padding: 24,
          minWidth: 260,
          flex: 1
        }}>
          <h4 style={{marginBottom: 12, color: "#2563eb"}}>System Health</h4>
          <ul style={{listStyle: "none", padding: 0, color: "#334155"}}>
            <li>CPU Usage: <b>23%</b></li>
            <li>Memory Usage: <b>68%</b></li>
            <li>Disk Space: <b>120GB / 256GB</b></li>
          </ul>
        </div>
        <div style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 8px #0001",
          padding: 24,
          minWidth: 260,
          flex: 1
        }}>
          <h4 style={{marginBottom: 12, color: "#2563eb"}}>Recent Events</h4>
          <ul style={{listStyle: "none", padding: 0, color: "#334155"}}>
            <li>✔️ Backup completed</li>
            <li>✔️ Image uploaded</li>
            <li>⚠️ High memory usage</li>
          </ul>
        </div>
      </div>
    </section>
  );
}