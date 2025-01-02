import React, { useState, useEffect } from 'react';
import './ExpensePage.css'; // Import the CSS file
import ExpenseDetailPage from './ExpenseDetailPage.js';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2'; // Import Doughnut chart from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import necessary Chart.js components
import { API_URL } from '../utils'; // Import API_URL from utils

// Register the Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem('user_type'));

  // State for filtering and sorting
  const [filterUser, setFilterUser] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  // For the Donut chart data
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_URL}/expenses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const expensesData = await response.json();
        setExpenses(expensesData);
        setFilteredExpenses(expensesData);
        updateCategoryData(expensesData); // Update category data with all expenses initially
      } catch (error) {
        console.error('Error fetching expenses', error);
      }
    };
    fetchExpenses();
  }, []);

  const updateCategoryData = (data) => {
    const categoryTotals = {};
    data.forEach((expense) => {
      const category = expense.category.category_name;
      const amount = expense.total_amount || 0;
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    // Prepare the data for the Donut chart
    const chartData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
          hoverBackgroundColor: ['#FF5A5E', '#36B3EB', '#FFDA58', '#4CD9D9', '#FFB141'],
        },
      ],
    };

    setCategoryData(chartData);
  };

  // Function to apply all filters and update filtered expenses
  const applyFilters = () => {
    let filtered = expenses;

    if (filterUser) {
      filtered = filtered.filter((expense) =>
        expense.user.naam.toLowerCase().includes(filterUser.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(
        (expense) =>
          expense.category.category_name.toLowerCase() ===
          filterCategory.toLowerCase()
      );
    }

    if (filterMonth) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.expense_date);
        return (
          expenseDate.getMonth() + 1 === parseInt(filterMonth) // Month is 0-indexed
        );
      });
    }

    setFilteredExpenses(filtered);
    updateCategoryData(filtered); // Update Donut chart with filtered data
  };

  const applySorting = () => {
    const sorted = [...filteredExpenses];
    if (sortBy === 'amount') {
      sorted.sort((a, b) => b.total_amount - a.total_amount);
    } else if (sortBy === 'date') {
      sorted.sort(
        (a, b) => new Date(b.expense_date) - new Date(a.expense_date)
      );
    }
    setFilteredExpenses(sorted);
  };

  const handleDownloadCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const filteredData = filteredExpenses; // Use filtered expenses data
  
      // If no filter is applied, we can still download all expenses data.
      if (filteredData.length === 0) {
        alert("No data to download with the applied filters.");
        return;
      }
  
      // Convert the filtered data to CSV format
      const csvContent = convertToCSV(filteredData);
  
      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
      // Create a link element to download the CSV
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'filtered_expenses.csv';
      link.click();
    } catch (error) {
      console.error('Error downloading CSV', error);
    }
  };

  const redirect = () =>{
    navigate("/newExpense")
  }

  const navigateToaddFunds = () =>{
    navigate("/addfunds")
  }

  // Function to convert the filtered data to CSV format
  const convertToCSV = (data) => {
    const headers = ['Description', 'Amount', 'Date', 'Category', 'User']; // CSV headers
    const rows = data.map((expense) => [
      expense.description,
      expense.total_amount ? expense.total_amount.toFixed(2) : 'N/A', // Check if total_amount exists
      new Date(expense.expense_date).toLocaleDateString(),
      expense.category.category_name,
      expense.user.naam,
    ]);
  
    // Combine headers and rows into a CSV string
    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');
  
    return csvContent;
  };

  // If an expense is selected, show its details
  if (selectedExpenseId) {
    return (
      <ExpenseDetailPage
        expenseId={selectedExpenseId}
        onBack={() => setSelectedExpenseId(null)}
      />
    );
  }

  return (
    <div className="expenses-page">
      <h1>Expenses</h1>
      <button className="download-button" onClick={redirect}>
          Add New Expense
        </button>
      {userType.replaceAll('"', '') === 'admin' && (
        <button className="download-button" onClick={handleDownloadCSV}>
          Download Expenses CSV
        </button>
      )}
      {userType.replaceAll('"', '') === 'admin' && (
        <button className="download-button" onClick={navigateToaddFunds}>
          Add funds
        </button>
      )}

      {/* Donut chart for category distribution */}
      <div className="chart-container" style={{ width: '300px', height: '300px' ,margin: '10px',alignItems:'center'}}>
        {categoryData && categoryData.labels ? (
          <Doughnut
            data={categoryData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Ensures the chart can be resized
              cutout: 60, // Controls the hole size (increase this number to make the hole bigger)
            }}
          />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by user"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filter by month (1-12)"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
        <button className="filter-button" onClick={applyFilters}>
          Apply Filters
        </button>
        <select
          className="sort-dropdown"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="amount">Amount</option>
          <option value="date">Date</option>
        </select>
        <button className="sort-button" onClick={applySorting}>
          Sort
        </button>
      </div>

      <table className="expenses-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.description}</td>
              <td>₹{expense.total_amount ? expense.total_amount.toFixed(2) : 'N/A'}</td>
              <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
              <td>{expense.category.category_name}</td>
              <td>{expense.user.naam}</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => setSelectedExpenseId(expense.id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ExpensesPage;
