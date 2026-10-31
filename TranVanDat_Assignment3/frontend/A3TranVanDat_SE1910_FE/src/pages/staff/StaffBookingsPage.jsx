import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    axiosClient
      .get("/staff/bookings")
      .then((res) => setBookings(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosClient.patch(`/staff/bookings/${id}/status`, {
        bookingStatus: status,
      });
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Bookings & Reservations</h1>
      <p className="page-subtitle">
        View and update all hotel reservation transactions
      </p>

      {loading ? (
        <div>Loading booking records...</div>
      ) : (
        bookings.map((item) => (
          <div key={item.bookingReservationId} className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontSize: "16px" }}>
                  Reservation #{item.bookingReservationId}
                </strong>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  Customer: <strong>{item.customerFullName}</strong> (
                  {item.customerEmail}) | Booked Date: {item.bookingDate}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  className={`badge ${item.bookingStatus === 1 ? "badge-confirmed" : item.bookingStatus === 2 ? "badge-active" : "badge-inactive"}`}
                >
                  {item.bookingStatus === 1
                    ? "Confirmed"
                    : item.bookingStatus === 2
                      ? "Completed"
                      : "Cancelled"}
                </span>
                <select
                  className="form-control"
                  style={{ width: "130px", padding: "4px 8px" }}
                  value={item.bookingStatus}
                  onChange={(e) =>
                    handleUpdateStatus(
                      item.bookingReservationId,
                      Number(e.target.value),
                    )
                  }
                >
                  <option value={1}>Confirmed</option>
                  <option value={2}>Completed</option>
                  <option value={0}>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="table-responsive" style={{ marginTop: "14px" }}>
              <table>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actual Price</th>
                  </tr>
                </thead>
                <tbody>
                  {item.details.map((d, i) => (
                    <tr key={i}>
                      <td>
                        <strong>Room {d.roomNumber}</strong>
                      </td>
                      <td>{d.roomTypeName}</td>
                      <td>{d.startDate}</td>
                      <td>{d.endDate}</td>
                      <td>${d.actualPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                textAlign: "right",
                marginTop: "12px",
                fontSize: "16px",
                fontWeight: "800",
                color: "var(--primary)",
              }}
            >
              Total Transaction: ${item.totalPrice}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
