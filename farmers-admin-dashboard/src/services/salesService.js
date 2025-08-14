import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const salesService = {
  getAllSales: async () => {
    try {
      const response = await api.get('/sales');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch sales');
    }
  },

  getSaleById: async (id) => {
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sale by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch sale');
    }
  },

  createSale: async (saleData) => {
    try {
      const response = await api.post('/sales', saleData);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new Error(error.response?.data?.message || 'Failed to create sale');
    }
  },

  updateSale: async (id, saleData) => {
    try {
      const response = await api.put(`/sales/${id}`, saleData);
      return response.data;
    } catch (error) {
      console.error('Error updating sale:', error);
      throw new Error(error.response?.data?.message || 'Failed to update sale');
    }
  },

  deleteSale: async (id) => {
    try {
      const response = await api.delete(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete sale');
    }
  },
};

export default salesService;
