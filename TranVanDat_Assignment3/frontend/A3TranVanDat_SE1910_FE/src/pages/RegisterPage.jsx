import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    customerFullName: "",
    emailAddress: "",
    telephone: "",
    customerBirthday: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ maxWidth: "440px", width: "100%" }}>
        <h2
          style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}
        >
          Create Customer Account
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          Join FU Mini Hotel to make online reservations
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={form.customerFullName}
              onChange={(e) =>
                setForm({ ...form, customerFullName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={form.emailAddress}
              onChange={(e) =>
                setForm({ ...form, emailAddress: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telephone</label>
            <input
              type="tel"
              className="form-control"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Birthday</label>
            <input
              type="date"
              className="form-control"
              value={form.customerBirthday}
              onChange={(e) =>
                setForm({ ...form, customerBirthday: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div
          style={{ textAlign: "center", marginTop: "16px", fontSize: "13px" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--primary)", fontWeight: "600" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
