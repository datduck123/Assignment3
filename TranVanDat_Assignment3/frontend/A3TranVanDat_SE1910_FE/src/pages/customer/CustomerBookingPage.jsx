import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { validateBookingItem, validateBookingSubmission } from "../../utils/validation";

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

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    return Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  };

  const totalPrice = bookingItems.reduce((acc, item) => {
    const days = calculateDays(item.startDate, item.endDate);
    return acc + Number(item.price || 0) * days;
  }, 0);

  const handleAddItem = () => {
    const validation = validateBookingItem({
      roomId: selectedRoomId,
      startDate,
      endDate,
      existingItems: bookingItems,
    });

    if (!validation.isValid) {
      alert(validation.error);
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
    const validation = validateBookingSubmission(bookingItems);
    if (!validation.isValid) {
      alert(validation.error);
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
    <div className="container" style={{ maxWidth: "860px" }}>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0 }}>2. Selected Rooms Summary</h3>
          {bookingItems.length > 0 && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              {bookingItems.length} room{bookingItems.length > 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        {bookingItems.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No rooms selected yet.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Days</th>
                    <th>Price/day</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingItems.map((item, idx) => {
                    const days = calculateDays(item.startDate, item.endDate);
                    const subtotal = Number(item.price || 0) * days;
                    return (
                      <tr key={idx}>
                        <td>
                          <strong>Room {item.roomNumber}</strong>
                        </td>
                        <td>{item.roomTypeName}</td>
                        <td>{item.startDate}</td>
                        <td>{item.endDate}</td>
                        <td>
                          {days} night{days > 1 ? "s" : ""}
                        </td>
                        <td>${Number(item.price).toFixed(2)}</td>
                        <td>
                          <strong style={{ color: "var(--text-main)" }}>
                            ${subtotal.toFixed(2)}
                          </strong>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveItem(idx)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Summary Box when rooms are selected */}
            <div
              style={{
                marginTop: "18px",
                padding: "16px 20px",
                background: "#f1f5f9",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Total Selected Rooms
                </div>
                <strong style={{ fontSize: "16px" }}>
                  {bookingItems.length} room{bookingItems.length > 1 ? "s" : ""}
                </strong>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Grand Total (All Rooms)
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "var(--primary)",
                  }}
                >
                  ${totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "20px", fontSize: "15px", padding: "12px" }}
          onClick={handleSubmitBooking}
          disabled={loading || bookingItems.length === 0}
        >
          {loading
            ? "Processing..."
            : `Confirm & Complete Booking (Total: $${totalPrice.toFixed(2)})`}
        </button>
      </div>
    </div>
  );
}
