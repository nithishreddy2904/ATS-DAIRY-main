import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const messageService = {
  getAllMessages: async () => {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  getMessageById: async (id) => {
    try {
      const response = await api.get(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch message');
    }
  },

  getMessagesByFarmerId: async (farmerId) => {
    try {
      const response = await api.get(`/messages/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages by farmer ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch messages by farmer ID');
    }
  },

  createMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error(error.response?.data?.message || 'Failed to create message');
    }
  },

  updateMessage: async (id, messageData) => {
    try {
      const response = await api.put(`/messages/${id}`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error updating message:', error);
      throw new Error(error.response?.data?.message || 'Failed to update message');
    }
  },

  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete message');
    }
  },

  updateMessageStatus: async (id, status) => {
  try {
    console.log(`API Call: PATCH /messages/${id}/status with body:`, { status });
    console.log(`Full URL: ${API_BASE_URL}/messages/${id}/status`);
    
    const response = await api.patch(`/messages/${id}/status`, { status });
    
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network Error: Cannot connect to server. Please check if the backend is running.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Message not found');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid status value');
    }
    
    if (error.message.includes('CORS')) {
      throw new Error('CORS Error: Server does not allow PATCH requests from this origin');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to update message status');
  }
},



  getMessageStats: async () => {
    try {
      const response = await api.get('/messages/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch message statistics');
    }
  },

  // Message specific methods
  getMessagesByStatus: async (status) => {
    try {
      const response = await api.get(`/messages?status=${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages by status:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch messages by status');
    }
  },

  getMessagesByPriority: async (priority) => {
    try {
      const response = await api.get(`/messages?priority=${encodeURIComponent(priority)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages by priority:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch messages by priority');
    }
  },

  getPendingMessages: async () => {
    try {
      const response = await api.get('/messages?status=Sent,Delivered');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending messages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pending messages');
    }
  },

  getFailedMessages: async () => {
    try {
      const response = await api.get('/messages?status=Failed');
      return response.data;
    } catch (error) {
      console.error('Error fetching failed messages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch failed messages');
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/messages/${id}/status`, { status: 'Read' });
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark message as read');
    }
  },

  markAsDelivered: async (id) => {
    try {
      const response = await api.patch(`/messages/${id}/status`, { status: 'Delivered' });
      return response.data;
    } catch (error) {
      console.error('Error marking message as delivered:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark message as delivered');
    }
  },
};

export default messageService;
