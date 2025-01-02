import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Card,
  CardContent,
} from '@mui/material';
import { authService } from '../services/authService';
import axios from 'axios';

const AddFundsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = authService.getToken();
        const response = await axios.get('http://localhost:8000/api/user/details/getall/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddFunds = async () => {
    if (!selectedUser || !amount || isNaN(amount) || amount <= 0) {
      setError('Please select a user and enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      await axios.post(
        'http://localhost:8000/api/add-funds/',
        { email: selectedUser, funds: parseFloat(amount) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Funds added successfully');
      setAmount('');
      setSelectedUser('');
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              fontWeight: 600,
              color: '#1a1a1a'
            }}
          >
            Add Funds
          </Typography>

          <FormControl 
            fullWidth 
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '&:hover fieldset': {
                  borderColor: '#6366F1',
                },
              },
            }}
          >
            <InputLabel sx={{ color: '#666' }}>Select User</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="Select User"
              sx={{
                '& .MuiSelect-select': {
                  padding: '14px',
                },
              }}
            >
              {users.map((user) => (
                <MenuItem key={user.email} value={user.email}>
                  {user.naam}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '&:hover fieldset': {
                  borderColor: '#6366F1',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666',
              },
            }}
            InputProps={{
              startAdornment: '₹',
              sx: {
                padding: '14px',
              }
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleAddFunds}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: '#6366F1',
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#4F46E5',
              },
              '&:disabled': {
                backgroundColor: '#A5B4FC',
              }
            }}
          >
            {loading ? 'Processing...' : 'Add Funds'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddFundsPage;