import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// ✅ Base API URL (from Vercel env)
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("adminToken");
  });

  const [loading, setLoading] = useState(false);

  // 🔐 Admin Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminEmail", data.email);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: "Network error" };
    }
  };

  // ✏️ Update Admin Profile
  const updateProfile = async (email, password) => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`${API_URL}/api/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
        }
        localStorage.setItem("adminEmail", data.email);
        setLoading(false);
        return { success: true, message: "Profile updated successfully" };
      } else {
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: "Network error" };
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminData");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
