import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const qualityTestService = {
  getAllTests: async () => {
    try {
      const response = await api.get('/lab-quality-tests');
      return response.data;
    } catch (error) {
      console.error('Error fetching quality tests:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quality tests');
    }
  },

  getTestById: async (id) => {
    try {
      const response = await api.get(`/lab-quality-tests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quality test by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quality test');
    }
  },

  createTest: async (testData) => {
    try {
      const response = await api.post('/lab-quality-tests', testData);
      return response.data;
    } catch (error) {
      console.error('Error creating quality test:', error);
      throw new Error(error.response?.data?.message || 'Failed to create quality test');
    }
  },

  updateTest: async (id, testData) => {
    try {
      const response = await api.put(`/lab-quality-tests/${id}`, testData);
      return response.data;
    } catch (error) {
      console.error('Error updating quality test:', error);
      throw new Error(error.response?.data?.message || 'Failed to update quality test');
    }
  },

  deleteTest: async (id) => {
    try {
      const response = await api.delete(`/lab-quality-tests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quality test:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete quality test');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/lab-quality-tests/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching quality test stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quality test statistics');
    }
  },

  // Quality test specific methods
  getTestsByGrade: async (grade) => {
    try {
      const response = await api.get(`/lab-quality-tests?grade=${encodeURIComponent(grade)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tests by grade:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tests by grade');
    }
  },

  getTestsByStatus: async (status) => {
    try {
      const response = await api.get(`/lab-quality-tests?status=${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tests by status:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tests by status');
    }
  },

  getFailedTests: async () => {
    try {
      const response = await api.get('/lab-quality-tests?status=Failed');
      return response.data;
    } catch (error) {
      console.error('Error fetching failed tests:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch failed tests');
    }
  },

  getPendingTests: async () => {
    try {
      const response = await api.get('/lab-quality-tests?status=Pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending tests:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pending tests');
    }
  },
};

export default qualityTestService;
