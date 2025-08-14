import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const inventoryService = {
  getAllRecords: async () => {
    try {
      const response = await api.get('/inventory-records');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory records:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch inventory records');
    }
  },

  getRecordById: async (id) => {
    try {
      const response = await api.get(`/inventory-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory record by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch inventory record');
    }
  },

  createRecord: async (recordData) => {
    try {
      const response = await api.post('/inventory-records', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creating inventory record:', error);
      throw new Error(error.response?.data?.message || 'Failed to create inventory record');
    }
  },

  updateRecord: async (id, recordData) => {
    try {
      const response = await api.put(`/inventory-records/${id}`, recordData);
      return response.data;
    } catch (error) {
      console.error('Error updating inventory record:', error);
      throw new Error(error.response?.data?.message || 'Failed to update inventory record');
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await api.delete(`/inventory-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting inventory record:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete inventory record');
    }
  },
};

export default inventoryService;
