import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const documentService = {
  getAllDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch documents');
    }
  },

  getDocumentById: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch document');
    }
  },

  createDocument: async (documentData) => {
    try {
      const response = await api.post('/documents', documentData);
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw new Error(error.response?.data?.message || 'Failed to create document');
    }
  },

  updateDocument: async (id, documentData) => {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error(error.response?.data?.message || 'Failed to update document');
    }
  },

  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete document');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/documents/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching document stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch document statistics');
    }
  },

  // Additional document-specific methods
  getDocumentsByType: async (type) => {
    try {
      const response = await api.get(`/documents?type=${encodeURIComponent(type)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents by type:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch documents by type');
    }
  },

  getDocumentsByCategory: async (category) => {
    try {
      const response = await api.get(`/documents?category=${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents by category:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch documents by category');
    }
  },

  getExpiredDocuments: async () => {
    try {
      const response = await api.get('/documents?status=expired');
      return response.data;
    } catch (error) {
      console.error('Error fetching expired documents:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch expired documents');
    }
  },

  getExpiringDocuments: async (days = 30) => {
    try {
      const response = await api.get(`/documents?expiring=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expiring documents:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch expiring documents');
    }
  },

  uploadDocument: async (formData) => {
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document file:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload document file');
    }
  },

  downloadDocument: async (id) => {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new Error(error.response?.data?.message || 'Failed to download document');
    }
  },
};

export default documentService;
