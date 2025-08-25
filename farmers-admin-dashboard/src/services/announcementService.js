import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const announcementService = {
  getAllAnnouncements: async () => {
    try {
      const response = await api.get('/announcements');
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch announcements');
    }
  },

  getAnnouncementById: async (id) => {
    try {
      const response = await api.get(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcement by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch announcement');
    }
  },

  createAnnouncement: async (announcementData) => {
    try {
      // Convert camelCase to snake_case for backend
      const payload = {
        ...announcementData,
        target_audience: announcementData.targetAudience || announcementData.target_audience,
        publish_date: announcementData.publishDate || announcementData.publish_date,
      };
      delete payload.targetAudience;
      delete payload.publishDate;

      const response = await api.post('/announcements', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new Error(error.response?.data?.message || 'Failed to create announcement');
    }
  },

  updateAnnouncement: async (id, announcementData) => {
    try {
      // Convert camelCase to snake_case for backend
      const payload = {
        ...announcementData,
        target_audience: announcementData.targetAudience || announcementData.target_audience,
        publish_date: announcementData.publishDate || announcementData.publish_date,
      };
      delete payload.targetAudience;
      delete payload.publishDate;

      const response = await api.put(`/announcements/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw new Error(error.response?.data?.message || 'Failed to update announcement');
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      const response = await api.delete(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete announcement');
    }
  },

  // Announcement specific methods
  getAnnouncementsByStatus: async (status) => {
    try {
      const response = await api.get(`/announcements?status=${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements by status:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch announcements by status');
    }
  },

  getAnnouncementsByPriority: async (priority) => {
    try {
      const response = await api.get(`/announcements?priority=${encodeURIComponent(priority)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements by priority:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch announcements by priority');
    }
  },

  getPublishedAnnouncements: async () => {
    try {
      const response = await api.get('/announcements?status=Published');
      return response.data;
    } catch (error) {
      console.error('Error fetching published announcements:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch published announcements');
    }
  },

  getDraftAnnouncements: async () => {
    try {
      const response = await api.get('/announcements?status=Draft');
      return response.data;
    } catch (error) {
      console.error('Error fetching draft announcements:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch draft announcements');
    }
  },

  updateAnnouncementStatus: async (id, status) => {
    try {
      const response = await api.patch(`/announcements/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating announcement status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update announcement status');
    }
  },

  incrementViews: async (id) => {
    try {
      const response = await api.patch(`/announcements/${id}/views`);
      return response.data;
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw new Error(error.response?.data?.message || 'Failed to increment views');
    }
  },
};

export default announcementService;
