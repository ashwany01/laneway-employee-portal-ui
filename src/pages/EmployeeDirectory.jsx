import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, [page, locationFilter, statusFilter]);

  async function loadEmployees() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("size", 10);

      if (locationFilter) params.set("location", locationFilter);
      if (statusFilter) params.set("status", statusFilter);

      const data = await apiRequest(`/employees?${params.toString()}`);

      setEmployees(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load employees. Please log in again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", textAlign: "left" }}>

      {/* NAVBAR */}
      <div
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          padding: "16px 24px",
          borderRadius: "10px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "white" }}>
            Laneway Employee Portal
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#cbd5e1",
              fontSize: "14px"
            }}
          >
            Welcome, {localStorage.getItem("name")}
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate("/hierarchy")}
            style={{
              marginRight: "10px",
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Hierarchy
          </button>

          <button
            onClick={() => navigate("/bench")}
            style={{
              marginRight: "10px",
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Bench Report
          </button>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div
        style={{
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <label>Location: </label>

        <select
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            marginLeft: "5px"
          }}
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All</option>
          <option value="KOTTAYAM_HQ">Kottayam HQ</option>
          <option value="BANGALORE">Bangalore</option>
          <option value="REMOTE">Remote</option>
        </select>

        <label style={{ marginLeft: "20px" }}>Status: </label>

        <select
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            marginLeft: "5px"
          }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_LEAVE">On Leave</option>
          <option value="EXITED">Exited</option>
        </select>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && !error && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead
              style={{
                backgroundColor: "#e7e9ec",
                color: "black"
              }}
            >
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Location</th>
                <th>Timezone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.workLocation}</td>
                  <td>{emp.timezone || "-"}</td>

                  <td>
                    <span
                      style={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        padding: "4px 8px",
                        borderRadius: "5px"
                      }}
                    >
                      {emp.employmentStatus}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => navigate(`/profile/${emp.id}`)}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          disabled={page === 0}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            cursor: "pointer"
          }}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 12px" }}>
          Page {page + 1} of {totalPages || 1}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            cursor: "pointer"
          }}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EmployeeDirectory;