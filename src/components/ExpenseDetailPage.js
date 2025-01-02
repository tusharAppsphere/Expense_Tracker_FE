// ExpenseDetailPage.js

import React, { useState, useEffect } from 'react';
import './ExpenseDetailPage.css';
import { API_URL } from '../utils';
import {IMAGE_BASE_URLS} from '../utils'

const ExpenseDetailPage = ({ expenseId, onBack }) => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/expenses/${expenseId}/`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch expense details');
        }

        const data = await response.json();
        setExpense(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExpenseDetails();
  }, [expenseId]);

  if (loading) {
    return <div>Loading expense details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!expense) {
    return <div>No expense found</div>;
  }

  return (
    <div className="kharch-detail-container">
      <button onClick={onBack}>Back to Expenses</button>
      
      <h2>Expense Details</h2>
      <hr/>
      
      <div className="kharch-info">
        <p><strong>Description:</strong> {expense.description}</p>
        <p><strong>Amount:</strong> ${expense.total_amount.toFixed(2)}</p>
        <p><strong>Price per Unit:</strong> ${expense.price.toFixed(2)}</p>
        <p><strong>Quantity:</strong> {expense.quantity}</p>
        <p><strong>Payment Mode:</strong> {expense.payment_mode}</p>
        <p><strong>Expense Date:</strong> {new Date(expense.expense_date).toLocaleString()}</p>
        
        <p><strong>Category:</strong> {expense.category.category_name}</p>
        <p><strong>Subcategory:</strong> {expense.subcategory.subcategory_name}</p>
      </div>
      <hr/>
      <div className='images-container'>
        {expense.transaction_image && (
          <div className="transaction-image image-section">
            <h3>Transaction Image</h3>
            <img 
             src={`${IMAGE_BASE_URLS}${expense.transaction_image}`}
              alt="Transaction Receipt" 
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}
        {expense.bill_image && (
          <div className="bill-image image-section">
            <h3>Bill Image</h3>
            <img 
              src={`${IMAGE_BASE_URLS}${expense.bill_image}`}
              alt="Bill Receipt" 
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}
      </div> 
    </div>
  );
};

export default ExpenseDetailPage;  // Make sure to use export default here.
