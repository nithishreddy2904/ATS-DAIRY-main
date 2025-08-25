import axios from 'axios';

// ✅ Make sure this matches your backend port
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('🚀 API Request:', request.method?.toUpperCase(), request.url);
  return request;
});

// ✅ Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const groupMessageService = {
  getAllGroupMessages: async () => {
    try {
      const response = await api.get('/group-messages');
      return response.data;
    } catch (error) {
      console.error('Error fetching group messages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch group messages');
    }
  },

  getGroupMessageById: async (id) => {
    try {
      const response = await api.get(`/group-messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group message:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch group message');
    }
  },

  createGroupMessage: async (groupMessageData) => {
    try {
      const payload = {
        group_name: groupMessageData.groupName || groupMessageData.group_name,
        message: groupMessageData.message,
        sender_name: groupMessageData.senderName || groupMessageData.sender_name,
        member_count: parseInt(groupMessageData.memberCount || groupMessageData.member_count) || 0,
        timestamp: groupMessageData.timestamp || new Date().toISOString().slice(0, 19).replace('T', ' ')
      };

      console.log('📤 Creating group message:', payload);
      const response = await api.post('/group-messages', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating group message:', error);
      throw new Error(error.response?.data?.message || 'Failed to create group message');
    }
  },

  updateGroupMessage: async (id, groupMessageData) => {
    try {
      const payload = {
        group_name: groupMessageData.groupName || groupMessageData.group_name,
        message: groupMessageData.message,
        sender_name: groupMessageData.senderName || groupMessageData.sender_name,
        member_count: parseInt(groupMessageData.memberCount || groupMessageData.member_count) || 0,
        timestamp: groupMessageData.timestamp
      };

      console.log('📝 Updating group message:', id, payload);
      const response = await api.put(`/group-messages/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating group message:', error);
      throw new Error(error.response?.data?.message || 'Failed to update group message');
    }
  },

  deleteGroupMessage: async (id) => {
    try {
      console.log('🗑️ Deleting group message:', id);
      const response = await api.delete(`/group-messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting group message:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete group message');
    }
  },

  getGroupMessagesByGroupName: async (groupName) => {
    try {
      const response = await api.get(`/group-messages/group/${encodeURIComponent(groupName)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group messages by group name:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch group messages by group name');
    }
  },

  getGroupMessageStats: async () => {
    try {
      const response = await api.get('/group-messages/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching group message stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch group message stats');
    }
  },
};

export default groupMessageService;
