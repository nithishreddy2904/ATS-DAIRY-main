import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const qualityControlService = {
  getAllRecords: async () => {
    try {
      const response = await api.get('/quality-control-records');
      return response.data;
    } catch (error) {
      console.error('Error fetching quality control records:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quality control records');
    }
  },

  getRecordById: async (id) => {
    try {
      const response = await api.get(`/quality-control-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quality control record by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quality control record');
    }
  },

  createRecord: async (recordData) => {
    try {
      const response = await api.post('/quality-control-records', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creating quality control record:', error);
      throw new Error(error.response?.data?.message || 'Failed to create quality control record');
    }
  },

  updateRecord: async (id, recordData) => {
    try {
      const response = await api.put(`/quality-control-records/${id}`, recordData);
      return response.data;
    } catch (error) {
      console.error('Error updating quality control record:', error);
      throw new Error(error.response?.data?.message || 'Failed to update quality control record');
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await api.delete(`/quality-control-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quality control record:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete quality control record');
    }
  },
};

export default qualityControlService;
