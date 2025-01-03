import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils';

const CreateExpensePage = () => {
  const { control, handleSubmit, register, watch } = useForm();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  const selectedCategory = watch('category_id');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = authService.getToken();
        const categoriesResponse = await axios.get(`${API_URL}/categories/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories based on the selected category
  // useEffect(() => {
  //   const fetchSubcategories = async () => {
  //     if (selectedCategory) {
  //       try {
  //         const token = authService.getToken();
  //         const subcategoriesResponse = await axios.get(`${API_URL}/subcategories/?category=${selectedCategory}`, {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         setSubcategories(subcategoriesResponse.data);
  //       } catch (error) {
  //         console.error('Error fetching subcategories', error);
  //       }
  //     }
  //   };
  //   fetchSubcategories();
  // }, [selectedCategory]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const token = authService.getToken();
      const formData = new FormData();

      // Append form fields to FormData
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value !== undefined && key !== 'transaction_image' && key !== 'bill_image') {
          formData.append(key, value);
        }
      });

      // Hardcoded subcategory_id
      formData.append('subcategory_id', 1);

      // Append image files
      if (data.transaction_image && data.transaction_image[0]) {
        formData.append('transaction_image', data.transaction_image[0]);
      }

      if (data.bill_image && data.bill_image[0]) {
        formData.append('bill_image', data.bill_image[0]);
      }

      console.log('FormData being sent:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      // Submit the form data via Axios
      await axios.post(`${API_URL}/expenses/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/allExpense');
    } catch (error) {
      console.error('Error creating expense', error);
      alert('Failed to create expense');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Create New Expense
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          {...register('description', { required: true })}
          margin="normal"
        />

        {/* Price */}
        <TextField
          fullWidth
          type="number"
          label="Price"
          {...register('price', { required: true, valueAsNumber: true })}
          margin="normal"
        />

        {/* Quantity */}
        <TextField
          fullWidth
          type="number"
          label="Quantity"
          {...register('quantity', { required: true, valueAsNumber: true })}
          margin="normal"
        />

        {/* Payment Mode */}
        <Controller
          name="payment_mode"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Mode</InputLabel>
              <Select {...field}>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="online">Online</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        {/* Category */}
        <Controller
          name="category_id"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select {...field}>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* Expense Date */}
        <TextField
          fullWidth
          type="datetime-local"
          label="Expense Date"
          InputLabelProps={{ shrink: true }}
          {...register('expense_date')}
          margin="normal"
        />

        {/* Transaction Image */}
        <TextField
          fullWidth
          type="file"
          label="Transaction Image"
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: 'image/*' }}
          {...register('transaction_image')}
          margin="normal"
        />

        {/* Billing Image */}
        <TextField
          fullWidth
          type="file"
          label="Billing Image"
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: 'image/*' }}
          {...register('bill_image')}
          margin="normal"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Expense
        </Button>
      </form>
    </Container>
  );
};

export default CreateExpensePage;
