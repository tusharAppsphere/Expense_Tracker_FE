import React from 'react';
import { Routes, Route, useLocation , Navigate } from 'react-router-dom';
import LoginPage from './components/logincomponent';
import ExpensesPage from './components/ExpenseManagementComponent';
import CreateExpensePage from './components/CreateExpense';
import AddFundsPage from './components/AddFunds';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import NotFoundPage from './components/NotFoundPage'; // Import the Not Found Page component

function App() {
  const location = useLocation(); // Get current location/path

  // Determine if Navbar should be visible
  const isNavbarVisible =
    location.pathname !== '/login' &&
    location.pathname !== '/' &&
    !location.pathname.startsWith('/404');

  return (
    <>
      {/* Conditionally render Navbar */}
      {isNavbarVisible && <Navbar />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/allExpense"
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newExpense"
          element={
            <ProtectedRoute>
              <CreateExpensePage />
            </ProtectedRoute>
          }
        />

        {/* Admin protected route */}
        <Route
          path="/addfunds"
          element={
            <ProtectedRoute isAdmin={true}>
              <AddFundsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for undefined paths */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;
