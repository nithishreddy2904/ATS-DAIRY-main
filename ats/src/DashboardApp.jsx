import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import Dashboard from './services/pages/Dashboard';
import FarmersSuppliers from './services/pages/FarmersSuppliers';
import MilkCollection from './services/pages/MilkCollection';
import Logistics from './services/pages/Logistics';
import ProcessingUnits from './services/pages/ProcessingUnits';
import SalesRetailers from './services/pages/SalesRetailers';
import Inventory from './services/pages/Inventory';
import Workforce from './services/pages/Workforce';
import Payments from './services/pages/Payments';
import Review from './services/pages/Review';
import Message from './services/pages/Message';
import Compliance from './services/pages/Compliance';
import QualityTest from './services/pages/QualityTest';

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
