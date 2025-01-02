import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userIsAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/allExpense" replace />;
  }

  return children;  
};

export default ProtectedRoute;
