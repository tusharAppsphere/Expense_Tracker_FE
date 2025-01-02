import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './login.scss'; // CSS for the layout and styling
import illustration from './salary02.jpg'; // Import the illustration image

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authService.login(data.email, data.password);
      navigate("/allExpense");
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className={errors.email ? 'error-input' : ''}
            />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>

      <div className="login-illustration">
        <img src={illustration} alt="Illustration" />
      </div>
    </div>
  );
};

export default LoginPage;
