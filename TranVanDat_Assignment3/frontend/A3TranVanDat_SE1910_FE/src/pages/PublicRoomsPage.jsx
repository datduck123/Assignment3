import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isCustomer } = useAuth();

  useEffect(() => {
    axiosClient
      .get("/rooms")
      .then((res) => setRooms(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Explore Available Rooms</h1>
      <p className="page-subtitle">
        Browse through our hotel rooms. No authentication required to view room
        information.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading room data...
        </div>
      ) : (
        <div className="grid-rooms">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span className="badge badge-confirmed">
                  {room.roomTypeName}
                </span>
                <span className="badge badge-active">Available</span>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >
                Room {room.roomNumber}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  flex: 1,
                  marginBottom: "14px",
                }}
              >
                {room.roomDetailDescription ||
                  "Comfortable room with all necessary amenities."}
              </p>
              <div style={{ fontSize: "13px", marginBottom: "10px" }}>
                Max Capacity: <strong>{room.roomMaxCapacity} guests</strong>
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "var(--primary)",
                  marginBottom: "16px",
                }}
              >
                ${room.roomPricePerDay}{" "}
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "var(--text-muted)",
                  }}
                >
                  / night
                </span>
              </div>
              {isCustomer ? (
                <Link
                  to="/customer/book"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  Book Now
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                >
                  Sign In to Book
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
