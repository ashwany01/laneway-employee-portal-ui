import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function HierarchyPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [hierarchy, setHierarchy] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployeeList();
  }, []);

  async function loadEmployeeList() {
    try {
      const data = await apiRequest("/employees?size=100");
      setEmployees(data.content);
    } catch (err) {
      setError("Failed to load employee list.");
    }
  }

  async function handleSelect(id) {
    setSelectedId(id);
    if (!id) {
      setHierarchy(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/employees/${id}/hierarchy`);
      setHierarchy(data);
    } catch (err) {
      setError("Failed to load hierarchy for this employee.");
      setHierarchy(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", textAlign: "left" }}>
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

      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Organization Hierarchy</h2>

      <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <label>Select an employee: </label>
        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", marginLeft: "10px" }}
        >
          <option value="">-- Choose --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>

        {loading && <p style={{ marginTop: "16px" }}>Loading...</p>}
        {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}

        {hierarchy && (
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ color: "#1e40af" }}>Management Chain (upward)</h3>
            {hierarchy.managementChain.length === 0 ? (
              <p style={{ color: "#64748b" }}>No managers above this employee.</p>
            ) : (
              hierarchy.managementChain.map((mgr) => (
                <div
                  key={mgr.id}
                  style={{
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {mgr.name} — {mgr.designation}
                </div>
              ))
            )}

            <h3 style={{ color: "#166534", marginTop: "24px" }}>
              {hierarchy.employee.name} (selected employee)
            </h3>

            <h3 style={{ color: "#92400e", marginTop: "24px" }}>Direct Reports (downward)</h3>
            {hierarchy.directReports.length === 0 ? (
              <p style={{ color: "#64748b" }}>No direct reports.</p>
            ) : (
              hierarchy.directReports.map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {rep.name} — {rep.designation}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HierarchyPage;