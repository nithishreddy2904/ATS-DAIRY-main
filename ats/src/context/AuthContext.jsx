import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const AuthContext = createContext({
  user: null,
  token: '',
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access') || '');
  const [loading, setLoading] = useState(true);

  // Bootstrap user on app start
  useEffect(() => {
  async function bootstrap() {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/auth/me');
      if(response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('access');
      setToken('');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  bootstrap();
}, [token]);


  // Login function with proper error handling
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response after calling auth/login:', response);
      if (response?.accessToken && response?.user) {
        const { accessToken, user: userData } = response;
        
        localStorage.setItem('access', accessToken);
        setToken(accessToken);
        setUser(userData);
        console.log('User logged in:', userData); 
        return true; // Success indicator for components
      }
      
throw new Error(response.data?.message || 'Incorrect email or password');      
    } catch (error) {
      console.error('Login failed:', error);
      
      // Clear any existing auth state
      localStorage.removeItem('access');
      setToken('');
      setUser(null);
     
      // Re-throw with user-friendly message
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup function with proper error handling
  const signup = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', { name, email, password });
      console.log('Signup response after calling auth/register:', response);
      if (response?.accessToken && response?.user) {
        const { accessToken, user: userData } = response;
        
        localStorage.setItem('access', accessToken);
        setToken(accessToken);
        setUser(userData);
        
        return true; // Success indicator for components
      }
      
      throw new Error('Invalid response format');
      
    } catch (error) {
      console.error('Signup failed:', error);
      
      // Clear any existing auth state
      localStorage.removeItem('access');
      setToken('');
      setUser(null);
      
      // Re-throw with user-friendly message
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint (optional - handles refresh token cleanup)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API fails
    }
    
    // Always clear local state
    localStorage.removeItem('access');
    setToken('');
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
