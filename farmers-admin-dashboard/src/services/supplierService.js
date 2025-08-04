// src/services/supplierService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Utility functions for field name conversion
const convertToSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    converted[snakeKey] = value;
  }
  return converted;
};

const convertToCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    converted[camelKey] = value;
  }
  return converted;
};

// Convert supplier data for API calls
const convertSupplierForAPI = (supplierData) => {
  console.log('🔄 Converting supplier data for API:', supplierData);
  
  if (!supplierData || typeof supplierData !== 'object') {
    return {};
  }

  // Direct field mappings (camelCase → snake_case) - FIXED APPROACH
  const fieldMappings = {
    'id': 'id',
    'companyName': 'company_name',
    'contactPerson': 'contact_person',
    'phone': 'phone', 
    'email': 'email',
    'address': 'address',
    'supplierType': 'supplier_type',
    'status': 'status',
    'joinDate': 'join_date'
  };

  const apiData = {};
  
  // Apply mappings for all fields present in input data
  Object.entries(fieldMappings).forEach(([frontendKey, backendKey]) => {
    if (supplierData[frontendKey] !== undefined) {
      apiData[backendKey] = supplierData[frontendKey];
    }
  });

  console.log('✅ Converted supplier data:', apiData);
  return apiData;
};

// Convert supplier data from API response
const convertSupplierFromAPI = (supplierData) => {
  if (!supplierData) return null;
  
  const converted = convertToCamelCase(supplierData);
  
  // Handle specific field mappings back to frontend format
  const fieldMappings = {
    company_name: 'companyName',
    contact_person: 'contactPerson',
    supplier_type: 'supplierType',
    join_date: 'joinDate'
  };
  
  const frontendData = { ...converted };
  
  // Apply specific mappings
  Object.keys(fieldMappings).forEach(backendKey => {
    if (supplierData[backendKey] !== undefined) {
      frontendData[fieldMappings[backendKey]] = supplierData[backendKey];
      // Remove the snake_case version
      delete frontendData[backendKey];
    }
  });
  
  return frontendData;
};

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    if (config.data) {
      console.log('Request data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response:', response.data);
    return response;
  },
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const supplierService = {
  // Get all suppliers
  getAllSuppliers: async () => {
    try {
      const response = await api.get('/suppliers');
      
      // Convert response data to frontend format
      if (response.data?.success && Array.isArray(response.data.data)) {
        const convertedSuppliers = response.data.data.map(convertSupplierFromAPI);
        return {
          ...response.data,
          data: convertedSuppliers
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting suppliers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch suppliers');
    }
  },

  // Create new supplier
  createSupplier: async (supplierData) => {
    try {
      console.log('Creating supplier with data:', supplierData);
      
      // Convert frontend data to API format
      const apiData = convertSupplierForAPI(supplierData);
      console.log('Converted API data:', apiData);
      
      const response = await api.post('/suppliers', apiData);
      
      // Convert response back to frontend format
      if (response.data?.success && response.data.data) {
        return {
          ...response.data,
          data: convertSupplierFromAPI(response.data.data)
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw new Error(error.response?.data?.message || 'Failed to create supplier');
    }
  },

  // Update supplier - FIXED IMPLEMENTATION WITH FIELD CONVERSION
  updateSupplier: async (id, supplierData) => {
  try {
    console.log('📡 Updating supplier with ID:', id);
    console.log('📤 Original frontend data:', supplierData);
    
    if (!id) {
      throw new Error('Supplier ID is required for update');
    }

    // Convert frontend data to API format (camelCase to snake_case)
    const apiData = convertSupplierForAPI(supplierData);
    console.log('🔄 Converted API data for update:', apiData);
    
    // Validate that all expected fields are present
    const requiredFields = ['id', 'company_name', 'contact_person', 'phone', 'email', 'address', 'supplier_type', 'status', 'join_date'];
    const missingFields = requiredFields.filter(field => !(field in apiData));
    if (missingFields.length > 0) {
      console.warn('⚠️ Missing fields in API data:', missingFields);
    }

    const response = await api.put(`/suppliers/${id}`, apiData);
    console.log('✅ Update response:', response.data);
    
    // Convert response back to frontend format
    if (response.data?.success && response.data.data) {
      return {
        ...response.data,
        data: convertSupplierFromAPI(response.data.data)
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error updating supplier:', error);
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Enhanced error handling
    if (error.response) {
      const message = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
},

  // Delete supplier
  deleteSupplier: async (id) => {
    try {
      console.log('Attempting to delete supplier with ID:', id);
      
      if (!id) {
        throw new Error('Supplier ID is required');
      }

      const response = await api.delete(`/suppliers/${id}`);
      console.log('Delete response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error deleting supplier:', error);
      
      // Enhanced error handling
      if (error.response) {
        const message = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }
};

export default supplierService;
