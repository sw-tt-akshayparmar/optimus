export default function Weather() {
  return (
    <section className="dashboard-section">
      <h2>Weather</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px #2563eb22",
            padding: 32,
            minWidth: 320,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", color: "#2563eb" }}>🌤️</div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: "12px 0 4px",
            }}
          >
            28°C
          </div>
          <div style={{ color: "#64748b" }}>Partly Cloudy</div>
          <div style={{ marginTop: 16, color: "#334155" }}>
            Ahmedabad, India
          </div>
        </div>
      </div>
    </section>
  );
}