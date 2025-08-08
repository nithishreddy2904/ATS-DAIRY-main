import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

const processingUnitService = {
  // Get all processing units
  getAllUnits: async () => {
    try {
      const response = await api.get('/processing-units');
      return response.data;
    } catch (error) {
      console.error('Error getting processing units:', error);
      if (error.response) {
        const message = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },

  // Create new processing unit
  createUnit: async (unitData) => {
    try {
      const response = await api.post('/processing-units', unitData);
      return response.data;
    } catch (error) {
      console.error('Error creating processing unit:', error);
      if (error.response) {
        const message = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },

  // Update processing unit
  updateUnit: async (id, unitData) => {
    try {
      if (!id) {
        throw new Error('Processing Unit ID is required for update.');
      }
      const response = await api.put(`/processing-units/${id}`, unitData);
      return response.data;
    } catch (error) {
      console.error('Error updating processing unit:', error);
      if (error.response) {
        const message = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },

  // Delete processing unit
  deleteUnit: async (id) => {
    try {
      console.log('Attempting to delete processing unit with ID:', id);
      if (!id) {
        throw new Error('Processing Unit ID is required for deletion.');
      }
      const response = await api.delete(`/processing-units/${id}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting processing unit:', error);
      if (error.response) {
        const message = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },
};

export default processingUnitService;