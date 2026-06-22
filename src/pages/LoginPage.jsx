import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("accessRole", data.accessRole);

      navigate("/employees");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
  style={{
    maxWidth: "550px",
    margin: "100px auto",
    backgroundColor: "white",
    padding: "35px",
    borderRadius: "12px",
    borderTop: "5px solid #2563eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "left"
  }}
>
      <h2
  style={{
    textAlign: "center",
    marginBottom: "8px"
  }}
>
  Laneway Employee Portal
</h2>
<p
  style={{
    textAlign: "center",
    color: "#64748b",
    marginBottom: "25px"
  }}
>
  Sign in to continue
</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "500" }}>
  Email
</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "5px",
  boxSizing: "border-box"
}}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "500" }}>
  Password
</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginTop: "5px",
  boxSizing: "border-box"
}}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
  type="submit"
  disabled={loading}
  style={{
  width: "100%",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px"
}}
>
  {loading ? "Logging in..." : "Login"}
</button>
      </form>
    </div>
  );
}

export default LoginPage;