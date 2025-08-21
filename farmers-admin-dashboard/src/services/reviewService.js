import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const reviewService = {
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  getReviewById: async (id) => {
    try {
      const response = await api.get(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching review by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch review');
    }
  },

  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  },

  updateReview: async (id, reviewData) => {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  },

  deleteReview: async (id) => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/reviews/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch review statistics');
    }
  },

  // Review specific methods
  getReviewsByCategory: async (category) => {
    try {
      const response = await api.get(`/reviews?category=${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by category:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews by category');
    }
  },

  getReviewsByStatus: async (status) => {
    try {
      const response = await api.get(`/reviews?status=${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by status:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews by status');
    }
  },

  getReviewsByRating: async (rating) => {
    try {
      const response = await api.get(`/reviews?rating=${rating}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by rating:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews by rating');
    }
  },

  getPendingReviews: async () => {
    try {
      const response = await api.get('/reviews?status=New,In Progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pending reviews');
    }
  },

  respondToReview: async (id, response) => {
    try {
      const responseData = await api.post(`/reviews/${id}/respond`, { response });
      return responseData.data;
    } catch (error) {
      console.error('Error responding to review:', error);
      throw new Error(error.response?.data?.message || 'Failed to respond to review');
    }
  },
};

export default reviewService;
