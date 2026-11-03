import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isStaff, isCustomer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        FU Mini Hotel
      </Link>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Public Rooms
        </NavLink>

        {isCustomer && (
          <>
            <NavLink
              to="/customer/book"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Reserve Room
            </NavLink>
            <NavLink
              to="/customer/history"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              My Bookings
            </NavLink>
            <NavLink
              to="/customer/profile"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              My Profile
            </NavLink>
          </>
        )}

        {isStaff && (
          <>
            <NavLink
              to="/staff/rooms"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Manage Rooms
            </NavLink>
            <NavLink
              to="/staff/customers"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Manage Customers
            </NavLink>
            <NavLink
              to="/staff/bookings"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Manage Bookings
            </NavLink>
          </>
        )}

        {user ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "12px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "600" }}>
              {user.name} ({user.role})
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
