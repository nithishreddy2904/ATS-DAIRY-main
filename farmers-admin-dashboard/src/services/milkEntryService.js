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

const milkEntryService = {
  // Get all milk entries
  getAllMilkEntries: async () => {
    try {
      const response = await api.get('/milk-entries');
      return response.data;
    } catch (error) {
      console.error('Error getting milk entries:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch milk entries');
    }
  },

  // Get milk entry by ID
  getMilkEntryById: async (id) => {
    try {
      const response = await api.get(`/milk-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting milk entry:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch milk entry');
    }
  },

  // Create new milk entry
  createMilkEntry: async (milkEntryData) => {
    try {
      const response = await api.post('/milk-entries', milkEntryData);
      return response.data;
    } catch (error) {
      console.error('Error creating milk entry:', error);
      throw new Error(error.response?.data?.message || 'Failed to create milk entry');
    }
  },

  // Update milk entry
  updateMilkEntry: async (id, milkEntryData) => {
    try {
      const response = await api.put(`/milk-entries/${id}`, milkEntryData);
      return response.data;
    } catch (error) {
      console.error('Error updating milk entry:', error);
      throw new Error(error.response?.data?.message || 'Failed to update milk entry');
    }
  },

  // Delete milk entry
  deleteMilkEntry: async (id) => {
    try {
      console.log('Attempting to delete milk entry with ID:', id);
      if (!id) {
        throw new Error('Milk entry ID is required');
      }

      const response = await api.delete(`/milk-entries/${id}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting milk entry:', error);
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

  // Get milk entry statistics
  getMilkEntryStats: async () => {
    try {
      const response = await api.get('/milk-entries/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting milk entry stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch milk entry statistics');
    }
  },

  // Get milk entries by farmer
  getMilkEntriesByFarmer: async (farmerId) => {
    try {
      const response = await api.get(`/milk-entries/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting farmer milk entries:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch farmer milk entries');
    }
  },

  // Get milk entries by date range
  getMilkEntriesByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/milk-entries/date-range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Error getting milk entries by date range:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch milk entries by date range');
    }
  }
};

export default milkEntryService;