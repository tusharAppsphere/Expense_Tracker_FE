import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css'; // Optional: Add CSS for styling

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/login'); // Redirect to the homepage or another specific route
  };

  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page Not Found</p>
      <button onClick={handleGoBack}>Go to Homepage</button>
    </div>
  );
};

export default NotFoundPage;
