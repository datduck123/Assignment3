import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { validateCustomerProfile } from "../../utils/validation";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState({
    customerFullName: "",
    telephone: "",
    emailAddress: "",
    customerBirthday: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosClient.get("/customer/profile").then((res) => {
      setProfile({
        customerFullName: res.customerFullName || "",
        telephone: res.telephone || "",
        emailAddress: res.emailAddress || "",
        customerBirthday: res.customerBirthday || "",
      });
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validation = validateCustomerProfile(profile);
    if (!validation.isValid) {
      setMsg({ type: "error", text: validation.error });
      return;
    }

    setMsg({ type: "", text: "" });
    setLoading(true);

    try {
      const payload = {
        ...profile,
        customerBirthday: profile.customerBirthday ? profile.customerBirthday : null,
      };
      await axiosClient.put("/customer/profile", payload);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <h1 className="page-title">Manage Profile</h1>
      <p className="page-subtitle">
        Keep your contact and account information updated.
      </p>

      <div className="card">
        {msg.text && (
          <div
            style={{
              background: msg.type === "success" ? "#dcfce7" : "#fee2e2",
              color: msg.type === "success" ? "#166534" : "#991b1b",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Email (Read Only)</label>
            <input
              type="email"
              className="form-control"
              value={profile.emailAddress}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={profile.customerFullName}
              onChange={(e) =>
                setProfile({ ...profile, customerFullName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telephone</label>
            <input
              type="tel"
              className="form-control"
              value={profile.telephone}
              onChange={(e) =>
                setProfile({ ...profile, telephone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Birthday</label>
            <input
              type="date"
              className="form-control"
              value={profile.customerBirthday}
              onChange={(e) =>
                setProfile({ ...profile, customerBirthday: e.target.value })
              }
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
