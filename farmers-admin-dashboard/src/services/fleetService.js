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

const fleetService = {
  // Get all fleet records
  getAllFleet: async () => {
    try {
      const response = await api.get('/fleet-management');
      return response.data;
    } catch (error) {
      console.error('Error getting fleet records:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch fleet records');
    }
  },

  // Get fleet record by ID
  getFleetById: async (id) => {
    try {
      const response = await api.get(`/fleet-management/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting fleet record:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch fleet record');
    }
  },

  // Create new fleet record
  createFleet: async (fleetData) => {
    try {
      const response = await api.post('/fleet-management', fleetData);
      return response.data;
    } catch (error) {
      console.error('Error creating fleet record:', error);
      throw new Error(error.response?.data?.message || 'Failed to create fleet record');
    }
  },

  // Update fleet record
  updateFleet: async (id, fleetData) => {
    try {
      const response = await api.put(`/fleet-management/${id}`, fleetData);
      return response.data;
    } catch (error) {
      console.error('Error updating fleet record:', error);
      throw new Error(error.response?.data?.message || 'Failed to update fleet record');
    }
  },

  // Delete fleet record
  deleteFleet: async (id) => {
    try {
      console.log('Attempting to delete fleet record with ID:', id);
      if (!id) {
        throw new Error('Fleet ID is required');
      }

      const response = await api.delete(`/fleet-management/${id}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting fleet record:', error);
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
  },

  // Get fleet statistics
  getFleetStats: async () => {
    try {
      const response = await api.get('/fleet-management/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting fleet stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch fleet statistics');
    }
  }
};

export default fleetService;