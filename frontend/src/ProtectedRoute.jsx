import React from "react";
import { Navigate } from "react-router-dom";

// not logged in => go to login page
// wrong role => go to home page
const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
