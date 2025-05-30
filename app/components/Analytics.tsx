import React from "react";
import "../routes/dashboard.css";

export default function Analytics() {
  return (
    <section className="dashboard-section">
      <h2>Analytics</h2>
      <div className="dashboard-analytics">
        <div className="analytics-chart">
          <h4>Views (Last 7 days)</h4>
          <img
            src="https://quickchart.io/chart?c={type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Views',data:[12,19,3,5,2,3,9]}]}}"
            alt="Views Chart"
          />
        </div>
        <div className="analytics-chart">
          <h4>Uploads (Last 7 days)</h4>
          <img
            src="https://quickchart.io/chart?c={type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Uploads',data:[2,3,20,5,1,4,7]}]}}"
            alt="Uploads Chart"
          />
        </div>
      </div>
    </section>
  );
}