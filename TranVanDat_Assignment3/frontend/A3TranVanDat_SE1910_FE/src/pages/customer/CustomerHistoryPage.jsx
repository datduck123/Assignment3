import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function CustomerHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/customer/bookings/history")
      .then((res) => setHistory(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">My Booking Reservation History</h1>
      <p className="page-subtitle">
        View all your current and past hotel bookings.
      </p>

      {loading ? (
        <div>Loading booking history...</div>
      ) : history.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          You have not made any room reservations yet.
        </div>
      ) : (
        history.map((item) => (
          <div key={item.bookingReservationId} className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div>
                <strong>Reservation #{item.bookingReservationId}</strong>
                <span
                  style={{
                    marginLeft: "12px",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  Booked on {item.bookingDate}
                </span>
              </div>
              <span
                className={`badge ${item.bookingStatus === 1 ? "badge-confirmed" : item.bookingStatus === 2 ? "badge-active" : "badge-inactive"}`}
              >
                {item.bookingStatus === 1
                  ? "Confirmed"
                  : item.bookingStatus === 2
                    ? "Completed"
                    : "Cancelled"}
              </span>
            </div>

            <div className="table-responsive" style={{ marginTop: "12px" }}>
              <table>
                <thead>
                  <tr>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actual Price</th>
                  </tr>
                </thead>
                <tbody>
                  {item.details.map((d, idx) => (
                    <tr key={idx}>
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
                marginTop: "14px",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              Total: ${item.totalPrice}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
