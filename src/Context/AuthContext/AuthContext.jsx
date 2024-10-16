import React, { createContext, useState, useEffect } from "react";
import axiosInstance, { setupInterceptors } from "../../Api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (jwtToken, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("token", jwtToken);
    }
    setToken(jwtToken);
    setupInterceptors(jwtToken); // Set up the interceptor when token is provided
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setupInterceptors(null); // Remove Authorization header by sending `null`
  };

  useEffect(() => {
    setupInterceptors(token); // Apply the token interceptor on initial load
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
