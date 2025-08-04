// src/services/farmerService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response:', response.data);
    return response;
  },
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const farmerService = {
  // Get all farmers
  getAllFarmers: async () => {
    try {
      const response = await api.get('/farmers');
      return response.data;
    } catch (error) {
      console.error('Error getting farmers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch farmers');
    }
  },

  // Create new farmer
  createFarmer: async (farmerData) => {
    try {
      const response = await api.post('/farmers', farmerData);
      return response.data;
    } catch (error) {
      console.error('Error creating farmer:', error);
      throw new Error(error.response?.data?.message || 'Failed to create farmer');
    }
  },

  // Update farmer
  updateFarmer: async (id, farmerData) => {
    try {
      const response = await api.put(`/farmers/${id}`, farmerData);
      return response.data;
    } catch (error) {
      console.error('Error updating farmer:', error);
      throw new Error(error.response?.data?.message || 'Failed to update farmer');
    }
  },

  // Delete farmer - FIXED IMPLEMENTATION
  deleteFarmer: async (id) => {
    try {
      console.log('Attempting to delete farmer with ID:', id);
      
      if (!id) {
        throw new Error('Farmer ID is required');
      }

      const response = await api.delete(`/farmers/${id}`);
      console.log('Delete response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error deleting farmer:', error);
      
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        // Request made but no response received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }
};

export default farmerService;
