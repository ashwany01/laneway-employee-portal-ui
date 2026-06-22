import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function BenchDashboard() {
  const navigate = useNavigate();
  const [threshold, setThreshold] = useState(50);
  const [entries, setEntries] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBenchReport();
  }, [threshold]);

  async function loadBenchReport() {
    setLoading(true);
    setError("");
    try {
      const benchData = await apiRequest(`/reports/bench?threshold=${threshold}`);
      setEntries(benchData);

      const allEmployees = await apiRequest(`/employees?size=200`);
      setTotalEmployees(allEmployees.totalElements);
    } catch (err) {
      setError("Failed to load bench report.");
    } finally {
      setLoading(false);
    }
  }

  const benchPercentage = totalEmployees > 0
    ? Math.round((entries.length / totalEmployees) * 100)
    : 0;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", textAlign: "left" }}>
      <button
        onClick={() => navigate("/employees")}
        style={{
          backgroundColor: "#e2e8f0",
          border: "none",
          padding: "10px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Back to Directory
      </button>

      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Bench / Utilization Dashboard</h2>

      <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>

        {/* SUMMARY CARDS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
          <div style={{ flex: 1, backgroundColor: "#dbeafe", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ margin: 0 }}>{entries.length}</h3>
            <p style={{ margin: 0 }}>Employees on Bench</p>
          </div>
          <div style={{ flex: 1, backgroundColor: "#dcfce7", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ margin: 0 }}>{benchPercentage}%</h3>
            <p style={{ margin: 0 }}>of Total Workforce</p>
          </div>
        </div>

        <label>Allocation threshold: </label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          style={{
            width: "80px",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            marginLeft: "8px",
          }}
        />
        <span style={{ marginLeft: "4px" }}>%</span>

        {loading && <p style={{ marginTop: "16px" }}>Loading...</p>}
        {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}

        {!loading && !error && (
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
            <thead style={{ backgroundColor: "#e7e9ec" }}>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Current Allocation</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", color: "#64748b" }}>
                    No employees under this threshold.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.employee.id}>
                    <td>{entry.employee.name}</td>
                    <td>{entry.employee.designation}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: entry.currentAllocation === 0 ? "#fee2e2" : "#fef3c7",
                          color: entry.currentAllocation === 0 ? "#991b1b" : "#92400e",
                          padding: "4px 8px",
                          borderRadius: "5px",
                        }}
                      >
                        {entry.currentAllocation}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BenchDashboard;