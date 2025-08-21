import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const certificationService = {
  getAllCertifications: async () => {
    try {
      const response = await api.get('/certifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch certifications');
    }
  },

  getCertificationById: async (id) => {
    try {
      const response = await api.get(`/certifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certification by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch certification');
    }
  },

  createCertification: async (certificationData) => {
    try {
      const response = await api.post('/certifications', certificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating certification:', error);
      throw new Error(error.response?.data?.message || 'Failed to create certification');
    }
  },

  updateCertification: async (id, certificationData) => {
    try {
      const response = await api.put(`/certifications/${id}`, certificationData);
      return response.data;
    } catch (error) {
      console.error('Error updating certification:', error);
      throw new Error(error.response?.data?.message || 'Failed to update certification');
    }
  },

  deleteCertification: async (id) => {
    try {
      const response = await api.delete(`/certifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting certification:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete certification');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/certifications/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching certification stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch certification statistics');
    }
  },

  getExpiringCertifications: async (days = 30) => {
    try {
      const response = await api.get(`/certifications/expiring/${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expiring certifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch expiring certifications');
    }
  },
};

export default certificationService;
