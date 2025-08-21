import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const auditService = {
  getAllAudits: async () => {
    try {
      const response = await api.get('/audits');
      return response.data;
    } catch (error) {
      console.error('Error fetching audits:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch audits');
    }
  },

  getAuditById: async (id) => {
    try {
      const response = await api.get(`/audits/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch audit');
    }
  },

  createAudit: async (auditData) => {
    try {
      const response = await api.post('/audits', auditData);
      return response.data;
    } catch (error) {
      console.error('Error creating audit:', error);
      throw new Error(error.response?.data?.message || 'Failed to create audit');
    }
  },

  updateAudit: async (id, auditData) => {
    try {
      const response = await api.put(`/audits/${id}`, auditData);
      return response.data;
    } catch (error) {
      console.error('Error updating audit:', error);
      throw new Error(error.response?.data?.message || 'Failed to update audit');
    }
  },

  deleteAudit: async (id) => {
    try {
      const response = await api.delete(`/audits/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting audit:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete audit');
    }
  },
};

export default auditService;
