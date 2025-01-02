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
import './createExpense.scss';

const CreateExpensePage = () => {
  const { control, handleSubmit, register, watch } = useForm();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [previewImages, setPreviewImages] = useState({
    transaction_image: null,
    bill_image: null
  });
  const navigate = useNavigate();
  
  const selectedCategory = watch('category');

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = authService.getToken();
        const categoriesResponse = await axios.get('http://localhost:8000/api/categories/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchData();
  }, []);

  // Fetch subcategories based on the selected category
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        try {
          const token = authService.getToken();
          const subcategoriesResponse = await axios.get(`http://localhost:8000/api/subcategories/?category=${selectedCategory}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSubcategories(subcategoriesResponse.data);
        } catch (error) {
          console.error('Error fetching subcategories', error);
        }
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const token = authService.getToken();
      const formData = new FormData();

      // Append form fields to FormData
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value !== undefined && key !== 'transaction_image' && key !== 'bill_image' && key !=='subcategory') {
          formData.append(key, value); // Use append for non-file fields
        }
      });

      formData.append('subcategory_id', 1);

      // Append the image files separately
      if (data.transaction_image && data.transaction_image[0]) {
        formData.append('transaction_image', data.transaction_image[0]);
      }

      if (data.bill_image && data.bill_image[0]) {
        formData.append('bill_image', data.bill_image[0]);
      }

      // Submit the form data via Axios
      await axios.post('http://localhost:8000/api/expenses/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });
      navigate("/allExpense");
    } catch (error) {
      console.error('Error creating expense', error);
      alert('Failed to create expense');
    }
  };

  // Handle image file preview
  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prevState) => ({
          ...prevState,
          [imageType]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="sm" className="kharch-form-container">
      <Typography variant="h4" align="center" gutterBottom className="kharch-form-title">
        Create New Expense
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          {...register('description', { required: true })}
          margin="normal"
          className="kharch-form-input"
        />
        
        {/* Price */}
        <TextField
          fullWidth
          type="number"
          label="Price"
          {...register('price', { required: true, valueAsNumber: true })}
          margin="normal"
          className="kharch-form-input"
        />
        
        {/* Quantity */}
        <TextField
          fullWidth
          type="number"
          label="Quantity"
          {...register('quantity', { required: true, valueAsNumber: true })}
          margin="normal"
          className="kharch-form-input"
        />

        {/* Payment Mode */}
        <Controller
          name="payment_mode"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" className="kharch-form-select">
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
            <FormControl fullWidth margin="normal" className="kharch-form-select">
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

        {/* Transaction Image */}
        <TextField
          fullWidth
          type="file"
          label="Transaction Image"
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: 'image/*' }}
          {...register('transaction_image')} // Register the file input
          onChange={(e) => handleImageChange(e, 'transaction_image')}
          margin="normal"
          className="kharch-form-file"
        />
        {previewImages.transaction_image && (
          <img src={previewImages.transaction_image} alt="Transaction Preview" width="100" />
        )}

        {/* Billing Image */}
        <TextField
          fullWidth
          type="file"
          label="Billing Image"
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: 'image/*' }}
          {...register('bill_image')} // Register the file input
          onChange={(e) => handleImageChange(e, 'bill_image')}
          margin="normal"
          className="kharch-form-file"
        />
        {previewImages.bill_image && (
          <img src={previewImages.bill_image} alt="Bill Preview" width="100" />
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          className="kharch-form-button"
        >
          Create Expense
        </Button>
      </form>
    </Container>
  );
};

export default CreateExpensePage;