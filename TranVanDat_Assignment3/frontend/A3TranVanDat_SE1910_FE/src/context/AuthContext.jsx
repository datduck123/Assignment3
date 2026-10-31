import React, { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hotel_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    localStorage.setItem("hotel_token", res.token);
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
    };
    localStorage.setItem("hotel_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    return await axiosClient.post("/auth/register", data);
  };

  const logout = () => {
    localStorage.removeItem("hotel_token");
    localStorage.removeItem("hotel_user");
    setUser(null);
  };

  const isStaff = user?.role === "STAFF";
  const isCustomer = user?.role === "CUSTOMER";

  return (
    <AuthContext.Provider
      value={{ user, isStaff, isCustomer, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
