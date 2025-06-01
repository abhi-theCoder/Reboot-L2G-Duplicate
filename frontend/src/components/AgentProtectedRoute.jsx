import React from 'react';
import { Navigate } from 'react-router-dom';

const AgentProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("Token");
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated || userRole !== "agent") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AgentProtectedRoute;
