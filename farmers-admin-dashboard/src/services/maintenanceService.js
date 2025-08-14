import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const maintenanceService = {
  getAllRecords: async () => {
    try {
      const response = await api.get('/maintenance-records');
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch maintenance records');
    }
  },

  getRecordById: async (id) => {
    try {
      const response = await api.get(`/maintenance-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance record by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch maintenance record');
    }
  },

  createRecord: async (recordData) => {
    try {
      const response = await api.post('/maintenance-records', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      throw new Error(error.response?.data?.message || 'Failed to create maintenance record');
    }
  },

  updateRecord: async (id, recordData) => {
    try {
      const response = await api.put(`/maintenance-records/${id}`, recordData);
      return response.data;
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      throw new Error(error.response?.data?.message || 'Failed to update maintenance record');
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await api.delete(`/maintenance-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete maintenance record');
    }
  },
};

export default maintenanceService;
