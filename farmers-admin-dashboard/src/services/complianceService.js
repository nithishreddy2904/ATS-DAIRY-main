import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const complianceService = {
  getAllRecords: async () => {
    try {
      const response = await api.get('/compliance-records');
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance records:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch compliance records');
    }
  },

  getRecordById: async (id) => {
    try {
      const response = await api.get(`/compliance-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance record by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch compliance record');
    }
  },

  createRecord: async (recordData) => {
    try {
      const response = await api.post('/compliance-records', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creating compliance record:', error);
      throw new Error(error.response?.data?.message || 'Failed to create compliance record');
    }
  },

  updateRecord: async (id, recordData) => {
    try {
      const response = await api.put(`/compliance-records/${id}`, recordData);
      return response.data;
    } catch (error) {
      console.error('Error updating compliance record:', error);
      throw new Error(error.response?.data?.message || 'Failed to update compliance record');
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await api.delete(`/compliance-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting compliance record:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete compliance record');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/compliance-records/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch compliance statistics');
    }
  },
};

export default complianceService;
