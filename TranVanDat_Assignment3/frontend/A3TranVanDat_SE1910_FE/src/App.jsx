import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PublicRoomsPage from "./pages/PublicRoomsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import CustomerBookingPage from "./pages/customer/CustomerBookingPage";
import CustomerHistoryPage from "./pages/customer/CustomerHistoryPage";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";

import StaffRoomsPage from "./pages/staff/StaffRoomsPage";
import StaffCustomersPage from "./pages/staff/StaffCustomersPage";
import StaffBookingsPage from "./pages/staff/StaffBookingsPage";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<PublicRoomsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Routes */}
          <Route
            path="/customer/book"
            element={
              <ProtectedRoute role="CUSTOMER">
                <CustomerBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/history"
            element={
              <ProtectedRoute role="CUSTOMER">
                <CustomerHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute role="CUSTOMER">
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/rooms"
            element={
              <ProtectedRoute role="STAFF">
                <StaffRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/customers"
            element={
              <ProtectedRoute role="STAFF">
                <StaffCustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/bookings"
            element={
              <ProtectedRoute role="STAFF">
                <StaffBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
