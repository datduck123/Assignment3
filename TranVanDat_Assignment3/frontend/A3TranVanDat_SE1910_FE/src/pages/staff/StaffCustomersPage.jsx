import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { validateStaffCustomer } from "../../utils/validation";

export default function StaffCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [modal, setModal] = useState({ isOpen: false, data: null });
  const [form, setForm] = useState({
    customerFullName: "",
    telephone: "",
    customerBirthday: "",
    customerStatus: 1,
  });

  useEffect(() => {
    loadCustomers();
  }, [keyword]);

  const loadCustomers = () => {
    axiosClient
      .get("/staff/customers", { params: { keyword } })
      .then((res) => setCustomers(res));
  };

  const openEdit = (c) => {
    setForm({
      customerFullName: c.customerFullName,
      telephone: c.telephone || "",
      customerBirthday: c.customerBirthday || "",
      customerStatus: c.customerStatus,
    });
    setModal({ isOpen: true, data: c });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validation = validateStaffCustomer(form);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      const payload = {
        ...form,
        customerBirthday: form.customerBirthday ? form.customerBirthday : null,
      };
      await axiosClient.put(`/staff/customers/${modal.data.customerId}`, payload);
      setModal({ isOpen: false, data: null });
      loadCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to disable customer account "${name}"?`,
      )
    )
      return;
    try {
      await axiosClient.delete(`/staff/customers/${id}`);
      loadCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Customers</h1>
      <p className="page-subtitle">
        Staff management of registered customer records
      </p>

      <div className="card">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "360px", marginBottom: "16px" }}
          placeholder="Search by customer name or email..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>Birthday</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customerId}>
                  <td>{c.customerId}</td>
                  <td>
                    <strong>{c.customerFullName}</strong>
                  </td>
                  <td>{c.emailAddress}</td>
                  <td>{c.telephone || "-"}</td>
                  <td>{c.customerBirthday || "-"}</td>
                  <td>
                    <span
                      className={`badge ${c.customerStatus === 1 ? "badge-active" : "badge-inactive"}`}
                    >
                      {c.customerStatus === 1 ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginRight: "6px" }}
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDelete(c.customerId, c.customerFullName)
                      }
                    >
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.isOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Edit Customer Account</h3>
            <form onSubmit={handleSave} style={{ marginTop: "16px" }}>
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
                <label className="form-label">Telephone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={form.telephone}
                  onChange={(e) =>
                    setForm({ ...form, telephone: e.target.value })
                  }
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
                <label className="form-label">Account Status</label>
                <select
                  className="form-control"
                  value={form.customerStatus}
                  onChange={(e) =>
                    setForm({ ...form, customerStatus: Number(e.target.value) })
                  }
                >
                  <option value={1}>Active</option>
                  <option value={0}>Disabled / Locked</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModal({ ...modal, isOpen: false })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
