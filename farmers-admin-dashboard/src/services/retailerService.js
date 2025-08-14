// src/services/retailerService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const retailerService = {
  getAllRetailers: async () => {
    try {
      const response = await api.get('/retailers');
      return response.data;
    } catch (error) {
      console.error('Error fetching retailers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch retailers');
    }
  },

  getRetailerById: async (id) => {
    try {
      const response = await api.get(`/retailers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching retailer by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch retailer');
    }
  },

  createRetailer: async (retailerData) => {
    try {
      const response = await api.post('/retailers', retailerData);
      return response.data;
    } catch (error) {
      console.error('Error creating retailer:', error);
      throw new Error(error.response?.data?.message || 'Failed to create retailer');
    }
  },

  updateRetailer: async (id, retailerData) => {
    try {
      const response = await api.put(`/retailers/${id}`, retailerData);
      return response.data;
    } catch (error) {
      console.error('Error updating retailer:', error);
      throw new Error(error.response?.data?.message || 'Failed to update retailer');
    }
  },

  deleteRetailer: async (id) => {
    try {
      const response = await api.delete(`/retailers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting retailer:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete retailer');
    }
  },
};

export default retailerService;
