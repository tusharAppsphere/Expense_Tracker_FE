import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import './Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(authService.getCurrentUser());

    // Dynamically update the document title based on the path
    switch(location.pathname) {
      case '/allExpense':
        document.title = 'All Expenses';
        break;
      case '/newExpense':
        document.title = 'Create New Expense';
        break;
      case '/addfunds':
        document.title = 'Add Funds';
        break;
      default:
        document.title = 'Expense Management';
    }
  }, [location]); // Re-run on route change

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>{document.title}</h3> {/* Display the dynamic title */}
      </div>
      
      <div className="navbar-right">
        <span className="user-name">{user?.naam}</span>
        <span className="user-funds">Funds: ₹ {user?.funds}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
