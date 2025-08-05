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

const deliveryService = {
  // Get all deliveries
  getAllDeliveries: async () => {
    try {
      const response = await api.get('/deliveries');
      return response.data;
    } catch (error) {
      console.error('Error getting deliveries:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch deliveries');
    }
  },

  // Get delivery by ID
  getDeliveryById: async (id) => {
    try {
      const response = await api.get(`/deliveries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting delivery:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch delivery');
    }
  },

  // Create new delivery
  createDelivery: async (deliveryData) => {
    try {
      const response = await api.post('/deliveries', deliveryData);
      return response.data;
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw new Error(error.response?.data?.message || 'Failed to create delivery');
    }
  },

  // Update delivery
  updateDelivery: async (id, deliveryData) => {
    try {
      const response = await api.put(`/deliveries/${id}`, deliveryData);
      return response.data;
    } catch (error) {
      console.error('Error updating delivery:', error);
      throw new Error(error.response?.data?.message || 'Failed to update delivery');
    }
  },

  // Delete delivery
  deleteDelivery: async (id) => {
    try {
      console.log('Attempting to delete delivery with ID:', id);
      if (!id) {
        throw new Error('Delivery ID is required');
      }

      const response = await api.delete(`/deliveries/${id}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting delivery:', error);
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

export default deliveryService;