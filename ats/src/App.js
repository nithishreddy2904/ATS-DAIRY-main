import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderWrapper } from './context/ThemeContext';
import { AppProvider } from './context/AppContext'; // Correct path
import ProtectedRoute from './components/ProtectedRoute';
import Login from './services/pages/Login';
import Signup from './services/pages/Signup';
import ForgotPassword from './services/pages/ForgotPassword';
import DashboardApp from './DashboardApp';

const App = () => {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <DashboardApp />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
};

export default App;
