import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import FarmersSuppliers from './pages/FarmersSuppliers';
import MilkCollection from './pages/MilkCollection';
import Logistics from './pages/Logistics';
import ProcessingUnits from './pages/ProcessingUnits';
import SalesRetailers from './pages/SalesRetailers';
import Inventory from './pages/Inventory';
import Workforce from './pages/Workforce';
import Payments from './pages/Payments';
import Review from './pages/Review';
import Message from './pages/Message';
import Compliance from './pages/Compliance';
import QualityTest from './pages/QualityTest';

const SIDEBAR_WIDTH = 0;

const DashboardApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Fixed NavBar at the top */}
      <NavBar onBurgerClick={() => setSidebarOpen((open) => !open)} />

      {/* Content below NavBar */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 0,
            transition: 'margin 0.1s',
            marginLeft: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
            mt: '64px', // Height of the AppBar
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farmers-suppliers" element={<FarmersSuppliers />} />
            <Route path="/milk-collection" element={<MilkCollection />} />
            <Route path="/logistics-distribution" element={<Logistics />} />
            <Route path="/processing-units" element={<ProcessingUnits />} />
            <Route path="/sales-retailers" element={<SalesRetailers />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/workforce-management" element={<Workforce />} />
            <Route path="/payments-bills" element={<Payments />} />
            <Route path="/compliance-certification" element={<Compliance />} />
            <Route path="/quality-test" element={<QualityTest />} />
            <Route path="/review" element={<Review />} />
            <Route path="/message" element={<Message />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardApp;
