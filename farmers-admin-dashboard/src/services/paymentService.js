import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const paymentService = {
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  },

  updatePayment: async (id, paymentData) => {
    try {
      const response = await api.put(`/payments/${id}`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw new Error(error.response?.data?.message || 'Failed to update payment');
    }
  },

  deletePayment: async (id) => {
    try {
      const response = await api.delete(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete payment');
    }
  },
};

export default paymentService;
