import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const billService = {
  getAllBills: async () => {
    try {
      const response = await api.get('/bills');
      return response.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bills');
    }
  },

  getBillById: async (id) => {
    try {
      const response = await api.get(`/bills/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bill');
    }
  },

  createBill: async (billData) => {
    try {
      const response = await api.post('/bills', billData);
      return response.data;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw new Error(error.response?.data?.message || 'Failed to create bill');
    }
  },

  updateBill: async (id, billData) => {
    try {
      const response = await api.put(`/bills/${id}`, billData);
      return response.data;
    } catch (error) {
      console.error('Error updating bill:', error);
      throw new Error(error.response?.data?.message || 'Failed to update bill');
    }
  },

  deleteBill: async (id) => {
    try {
      const response = await api.delete(`/bills/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete bill');
    }
  },
};

export default billService;
