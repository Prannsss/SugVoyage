import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if needed

// Get all spots with optional filtering
export const getSpots = async (category = null, featured = null) => {
  try {
    const params = {};
    if (category && category !== 'all') {
      params.category = category;
    }
    if (featured === 'true') {
      params.featured = featured;
    }

    const response = await axios.get(`${API_BASE_URL}/spots`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching spots:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch spots');
  }
};

// Get spot by ID
export const getSpotsById = async (id) => {
  try {
    if (!id) {
      throw new Error('Spot ID is required');
    }

    const response = await axios.get(`${API_BASE_URL}/spots/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching spot:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch spot');
  }
};

// Add new spot
export const addSpots = async (spotData) => {
  try {
    const { name, location, latitude, longitude, type, category, description } = spotData;

    // Validate required fields
    if (!name || !location || latitude === undefined || longitude === undefined || !type || !category) {
      throw new Error('Missing required fields: name, location, latitude, longitude, type, category');
    }

    // Validate numeric values
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Latitude and longitude must be numbers');
    }

    const response = await axios.post(`${API_BASE_URL}/spots`, spotData);
    return response.data;
  } catch (error) {
    console.error('Error creating spot:', error);
    throw new Error(error.response?.data?.message || 'Failed to create spot');
  }
};

// Get spots by category
export const getSpotsByCategory = async (category) => {
  try {
    if (!category) {
      throw new Error('Category is required');
    }

    const response = await axios.get(`${API_BASE_URL}/spots/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching spots by category:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch spots by category');
  }
};

// Get featured spots
export const getFeaturedSpots = async (limit = 6) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/spots/featured`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured spots:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch featured spots');
  }
};
