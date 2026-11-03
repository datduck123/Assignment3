import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "STAFF") {
        navigate("/staff/rooms");
      } else {
        navigate("/customer/history");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please verify credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <h2
          style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}
        >
          Welcome Back
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          Customer & Staff Portal Login
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. staff@fuhotel.com or customer email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div
          style={{ textAlign: "center", marginTop: "16px", fontSize: "13px" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--primary)", fontWeight: "600" }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
