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
import ProcessingUnitsTable from './components/ProcessingUnitsTable';
import ProductionBatchesTable from "./components/ProductionBatchesTable";
import QualityControlTable from './components/QualityControlTable';
import MaintenanceTable from './components/MaintenanceTable';
import RetailersTable from './components/RetailersTable';
import SalesTable from './components/SalesTable';
import InventoryTable from './components/InventoryTable';
import EmployeesTable from './components/EmployeesTable';
import PaymentsTable from './components/PaymentsTable';
import BillsTable from './components/BillsTable';
import ComplianceTable from './components/ComplianceTable';
import CertificationsTable from './components/CertificationsTable';
import AuditsTable from './components/AuditsTable';
import DocumentsTable from './components/DocumentsTable';
import QualityTestTable from './components/QualityTestTable';
import CustomerReviewsTable from './components/CustomerReviewsTable';
import FarmerFeedbackTable from './components/FarmerFeedbackTable';
import MessageHistoryTable from './components/MessageHistoryTable';
import AnnouncementHistoryTable from './components/AnnouncementHistoryTable';
import GroupConversationsTable from './components/GroupConversationsTable';

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
            <Route path="/processing-units" element={<ProcessingUnitsTable />} />
            <Route path="/production-batches" element={<ProductionBatchesTable />} />
            <Route path="/quality-control" element={<QualityControlTable />} />
            <Route path="/maintenance" element={<MaintenanceTable />} />
            <Route path="/retailers" element={<RetailersTable />} />
            <Route path="/sales" element={<SalesTable />} />
            <Route path="/inventory" element={<InventoryTable />} />
            <Route path="/employees" element={<EmployeesTable />} />
            <Route path="/payments" element={<PaymentsTable />} />
            <Route path="/bills" element={<BillsTable />} />
            <Route path="/compliance" element={<ComplianceTable />} />
            <Route path="/certifications" element={<CertificationsTable />} />
            <Route path="/audits" element={<AuditsTable />} />
            <Route path="/documents" element={<DocumentsTable />} />
            <Route path="/quality-tests" element={<QualityTestTable />} />
            <Route path="/customer-reviews" element={<CustomerReviewsTable />} />
            <Route path="/farmer-feedback" element={<FarmerFeedbackTable />} />
            <Route path="/message-history" element={<MessageHistoryTable />} />
            <Route path="/announcement-history" element={<AnnouncementHistoryTable />} />
            <Route path="/group-conversations" element={<GroupConversationsTable />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
