import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function CustomerBookingPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingItems, setBookingItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/rooms").then((res) => setRooms(res));
  }, []);

  const handleAddItem = () => {
    if (!selectedRoomId || !startDate || !endDate) {
      alert("Please select room, start date and end date");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be after Start date");
      return;
    }
    const room = rooms.find((r) => r.roomId === Number(selectedRoomId));
    setBookingItems([
      ...bookingItems,
      {
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        roomTypeName: room.roomTypeName,
        price: room.roomPricePerDay,
        startDate,
        endDate,
      },
    ]);
    setSelectedRoomId("");
  };

  const handleRemoveItem = (index) => {
    setBookingItems(bookingItems.filter((_, i) => i !== index));
  };

  const handleSubmitBooking = async () => {
    if (bookingItems.length === 0) {
      alert("Please add at least one room reservation item");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const payload = {
        items: bookingItems.map((item) => ({
          roomId: item.roomId,
          startDate: item.startDate,
          endDate: item.endDate,
        })),
      };
      await axiosClient.post("/customer/bookings", payload);
      alert("Booking created successfully!");
      navigate("/customer/history");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create booking reservation",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <h1 className="page-title">Online Room Reservation</h1>
      <p className="page-subtitle">
        Select one or multiple rooms to create a reservation.
      </p>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>1. Add Room Selection</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
          }}
        >
          <div className="form-group">
            <label className="form-label">Select Room</label>
            <select
              className="form-control"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">-- Choose Room --</option>
              {rooms.map((r) => (
                <option key={r.roomId} value={r.roomId}>
                  Room {r.roomNumber} ({r.roomTypeName}) - ${r.roomPricePerDay}
                  /day
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Check-in Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Check-out Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleAddItem}>
          + Add to Reservation
        </button>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>2. Selected Rooms Summary</h3>
        {bookingItems.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No rooms selected yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Price/day</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookingItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.roomNumber}</strong>
                    </td>
                    <td>{item.roomTypeName}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>${item.price}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "20px" }}
          onClick={handleSubmitBooking}
          disabled={loading || bookingItems.length === 0}
        >
          {loading ? "Processing..." : "Confirm & Complete Booking"}
        </button>
      </div>
    </div>
  );
}
