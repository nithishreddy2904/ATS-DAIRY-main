import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Layout from './components/Layout';
import FarmersTable from './components/FarmersTable';
import SuppliersTable from './components/SuppliersTable';
import Dashboard from './components/Dashboard';
import MilkEntriesTable from './components/MilkEntriesTable';
import FleetTable from './components/FleetTable';
import DeliveriesTable from './components/DeliveriesTable';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farmers" element={<FarmersTable />} />
            <Route path="/suppliers" element={<SuppliersTable />} />
            <Route path="/milk-entries" element={<MilkEntriesTable />} />
            <Route path="/fleet" element={<FleetTable />} /> 
            <Route path="/deliveries" element={<DeliveriesTable />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
