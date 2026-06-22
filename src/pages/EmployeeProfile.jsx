import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmployee();
  }, [id]);

  async function loadEmployee() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/employees/${id}`);
      setEmployee(data);
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        designation: data.designation,
        accessRole: data.accessRole,
        workLocation: data.workLocation,
        timezone: data.timezone || "",
        dateOfJoining: data.dateOfJoining,
        employmentStatus: data.employmentStatus,
      });
    } catch (err) {
      setError("Failed to load employee.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setEditing(false);
      loadEmployee();
    } catch (err) {
      setError("Failed to update employee. " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error && !employee) return <p style={{ color: "red" }}>{error}</p>;
  if (!employee) return null;

  return (
    <div
  style={{
    maxWidth: "700px",
    margin: "40px auto",
    textAlign: "left"
  }}
>
      <button
  onClick={() => navigate("/employees")}
  style={{
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "20px"
  }}
>
  ← Back to Directory
</button>

      <h2
  style={{
    color: "#1e293b",
    marginBottom: "20px"
  }}
>
  Employee Profile
</h2>

<div
  style={{
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }}
>

{!editing ? (
        <div>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          <p><strong>Access Role:</strong> {employee.accessRole}</p>
          <p><strong>Location:</strong> {employee.workLocation}</p>
          <p><strong>Timezone:</strong> {employee.timezone || "-"}</p>
          <p><strong>Date of Joining:</strong> {employee.dateOfJoining}</p>
          <p><strong>Status:</strong> {employee.employmentStatus}</p>
          <button
  onClick={() => setEditing(true)}
  style={{
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px"
  }}
>
  Edit Employee
</button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name</label><br />
            <input name="name" value={formData.name} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email</label><br />
            <input name="email" value={formData.email} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Password (re-enter to keep unchanged)</label><br />
            <input name="password" type="password" value={formData.password} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Designation</label><br />
            <input name="designation" value={formData.designation} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Access Role</label><br />
            <select name="accessRole" value={formData.accessRole} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}}>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Location</label><br />
            <select name="workLocation" value={formData.workLocation} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}}>
              <option value="KOTTAYAM_HQ">Kottayam HQ</option>
              <option value="BANGALORE">Bangalore</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Timezone</label><br />
            <input name="timezone" value={formData.timezone} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Employment Status</label><br />
            <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} style={{
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "4px",
  boxSizing: "border-box"
}}>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="EXITED">Exited</option>
            </select>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
  type="submit"
  disabled={saving}
  style={{
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  {saving ? "Saving..." : "Save"}</button>
          <button
  type="button"
  onClick={() => setEditing(false)}
  style={{
    marginLeft: "10px",
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>Cancel</button>
        </form>
      )}
      </div>
    </div>
  );
}

export default EmployeeProfile;