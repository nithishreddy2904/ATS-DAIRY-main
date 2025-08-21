import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const farmerFeedbackService = {
  getAllFeedback: async () => {
    try {
      const response = await api.get('/farmer-feedback');
      return response.data;
    } catch (error) {
      console.error('Error fetching farmer feedback:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch farmer feedback');
    }
  },

  getFeedbackById: async (id) => {
    try {
      const response = await api.get(`/farmer-feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farmer feedback by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch farmer feedback');
    }
  },

  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/farmer-feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating farmer feedback:', error);
      throw new Error(error.response?.data?.message || 'Failed to create farmer feedback');
    }
  },

  updateFeedback: async (id, feedbackData) => {
    try {
      const response = await api.put(`/farmer-feedback/${id}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error updating farmer feedback:', error);
      throw new Error(error.response?.data?.message || 'Failed to update farmer feedback');
    }
  },

  deleteFeedback: async (id) => {
    try {
      const response = await api.delete(`/farmer-feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting farmer feedback:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete farmer feedback');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/farmer-feedback/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching farmer feedback stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch farmer feedback statistics');
    }
  },

  // Farmer feedback specific methods
  getFeedbackByType: async (type) => {
    try {
      const response = await api.get(`/farmer-feedback?feedback_type=${encodeURIComponent(type)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback by type:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback by type');
    }
  },

  getFeedbackByStatus: async (status) => {
    try {
      const response = await api.get(`/farmer-feedback?status=${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback by status:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback by status');
    }
  },

  getFeedbackByPriority: async (priority) => {
    try {
      const response = await api.get(`/farmer-feedback?priority=${encodeURIComponent(priority)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback by priority:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback by priority');
    }
  },

  getOpenFeedback: async () => {
    try {
      const response = await api.get('/farmer-feedback?status=Open');
      return response.data;
    } catch (error) {
      console.error('Error fetching open feedback:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch open feedback');
    }
  },

  getHighPriorityFeedback: async () => {
    try {
      const response = await api.get('/farmer-feedback?priority=High');
      return response.data;
    } catch (error) {
      console.error('Error fetching high priority feedback:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch high priority feedback');
    }
  },
};

export default farmerFeedbackService;
