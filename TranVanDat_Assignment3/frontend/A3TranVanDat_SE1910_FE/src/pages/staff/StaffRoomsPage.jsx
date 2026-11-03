import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { validateRoom } from "../../utils/validation";

export default function StaffRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    mode: "CREATE",
    data: null,
  });
  const [form, setForm] = useState({
    roomNumber: "",
    roomDetailDescription: "",
    roomMaxCapacity: 2,
    roomTypeId: "",
    roomStatus: 1,
    roomPricePerDay: 50,
  });

  useEffect(() => {
    loadRooms();
    axiosClient.get("/room-types").then((res) => setRoomTypes(res));
  }, [keyword]);

  const loadRooms = () => {
    axiosClient
      .get("/staff/rooms", { params: { keyword } })
      .then((res) => setRooms(res));
  };

  const openCreate = () => {
    setForm({
      roomNumber: "",
      roomDetailDescription: "",
      roomMaxCapacity: 2,
      roomTypeId: roomTypes[0]?.roomTypeId || "",
      roomStatus: 1,
      roomPricePerDay: 50,
    });
    setModal({ isOpen: true, mode: "CREATE", data: null });
  };

  const openEdit = (room) => {
    setForm({
      roomNumber: room.roomNumber,
      roomDetailDescription: room.roomDetailDescription || "",
      roomMaxCapacity: room.roomMaxCapacity,
      roomTypeId: room.roomTypeId,
      roomStatus: room.roomStatus,
      roomPricePerDay: room.roomPricePerDay,
    });
    setModal({ isOpen: true, mode: "UPDATE", data: room });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validation = validateRoom(form);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      if (modal.mode === "CREATE") {
        await axiosClient.post("/staff/rooms", form);
      } else {
        await axiosClient.put(`/staff/rooms/${modal.data.roomId}`, form);
      }
      setModal({ isOpen: false, mode: "CREATE", data: null });
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving room");
    }
  };

  const handleDelete = async (roomId, roomNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete or inactivate Room ${roomNumber}?`,
      )
    )
      return;
    try {
      await axiosClient.delete(`/staff/rooms/${roomId}`);
      alert(
        "Room deleted or status updated to Inactive according to business rules.",
      );
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 className="page-title">Manage Rooms</h1>
          <p className="page-subtitle">
            Staff CRUD & Search operations for hotel rooms
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add New Room
        </button>
      </div>

      <div className="card">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "360px", marginBottom: "16px" }}
          placeholder="Search by room number or description..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Number</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price/Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.roomId}>
                  <td>{r.roomId}</td>
                  <td>
                    <strong>Room {r.roomNumber}</strong>
                  </td>
                  <td>{r.roomTypeName}</td>
                  <td>{r.roomMaxCapacity} guests</td>
                  <td>${r.roomPricePerDay}</td>
                  <td>
                    <span
                      className={`badge ${r.roomStatus === 1 ? "badge-active" : "badge-inactive"}`}
                    >
                      {r.roomStatus === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginRight: "6px" }}
                      onClick={() => openEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(r.roomId, r.roomNumber)}
                    >
                      Delete
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
            <h3>{modal.mode === "CREATE" ? "Add Room" : "Edit Room"}</h3>
            <form onSubmit={handleSave} style={{ marginTop: "16px" }}>
              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.roomNumber}
                  onChange={(e) =>
                    setForm({ ...form, roomNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Type</label>
                <select
                  className="form-control"
                  value={form.roomTypeId}
                  onChange={(e) =>
                    setForm({ ...form, roomTypeId: e.target.value ? Number(e.target.value) : "" })
                  }
                  required
                >
                  <option value="">-- Select Room Type --</option>
                  {roomTypes.map((t) => (
                    <option key={t.roomTypeId} value={t.roomTypeId}>
                      {t.roomTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.roomMaxCapacity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      roomMaxCapacity: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price Per Day ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.roomPricePerDay}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      roomPricePerDay: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={form.roomStatus}
                  onChange={(e) =>
                    setForm({ ...form, roomStatus: Number(e.target.value) })
                  }
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive / Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={form.roomDetailDescription}
                  onChange={(e) =>
                    setForm({ ...form, roomDetailDescription: e.target.value })
                  }
                />
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
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
