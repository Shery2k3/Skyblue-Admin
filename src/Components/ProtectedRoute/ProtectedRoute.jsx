import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext/AuthContext";

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { token } = useContext(AuthContext);
  const isAuthenticated = token || localStorage.getItem("token");

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;