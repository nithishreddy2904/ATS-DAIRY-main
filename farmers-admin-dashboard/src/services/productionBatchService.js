import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

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

const productionBatchService = {
  // Get all production batches
  getAllProductionBatches: async () => {
    try {
      const response = await api.get('/production-batches');
      return response.data;
    } catch (error) {
      console.error('Error getting production batches:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch production batches');
    }
  },

  // Create new production batch
  createBatch: async (batchData) => {
    try {
      const response = await api.post('/production-batches', batchData);
      return response.data;
    } catch (error) {
      console.error('Error creating production batch:', error);
      throw new Error(error.response?.data?.message || 'Failed to create production batch');
    }
  },

  // Update production batch
  updateBatch: async (id, batchData) => {
    try {
      const response = await api.put(`/production-batches/${id}`, batchData);
      return response.data;
    } catch (error) {
      console.error('Error updating production batch:', error);
      throw new Error(error.response?.data?.message || 'Failed to update production batch');
    }
  },

  // Delete production batch
  deleteBatch: async (id) => {
    try {
      if (!id) {
        throw new Error('Production batch ID is required');
      }
      const response = await api.delete(`/production-batches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting production batch:', error);
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

export default productionBatchService;
