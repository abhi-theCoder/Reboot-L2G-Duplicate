import React from 'react';
import { Navigate } from 'react-router-dom';

const SuperadminProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("Token");
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated || userRole !== "superadmin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default SuperadminProtectedRoute;
