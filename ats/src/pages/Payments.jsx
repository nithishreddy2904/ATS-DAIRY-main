import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, Avatar, Stack, Badge, Tabs, Tab, Radio, RadioGroup, FormControlLabel,
  CircularProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';

// For charts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Validation regex patterns
const FARMER_ID_REGEX = /^[A-Za-z]+[0-9]{4}$/;
const NUMERIC_REGEX = /^\d*\.?\d*$/;
const BILL_ID_REGEX = /^[A-Z]{3}[0-9]{4}$/;

const PAYMENT_MODES = ['Bank Transfer', 'Cash', 'Check', 'UPI', 'Digital Wallet'];
const PAYMENT_STATUS = ['Completed', 'Pending', 'Failed', 'Processing'];
const BILL_STATUS = ['Paid', 'Unpaid', 'Overdue', 'Partially Paid'];
const BILL_CATEGORIES = ['Milk Purchase', 'Equipment', 'Maintenance', 'Transport', 'Utilities', 'Other'];


const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  // Handle both ISO string and MySQL datetime formats
  const date = new Date(timestamp);
  
  // Format as: Jun 09, 2025
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour12: false
  }).split(',')[0]; // Remove time part, only show date
};

const Payments = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);

  // Backend integration - Get data from context
  const {
    paymentsFromDB,
    billsFromDB,
    paymentsLoading,
    billsLoading,
    addPaymentToDB,
    updatePaymentInDB,
    deletePaymentFromDB,
    addBillToDB,
    updateBillInDB,
    deleteBillFromDB,
    farmers,
    loading,
    error
  } = useAppContext();

  // Payments State
  const [paymentForm, setPaymentForm] = useState({
    farmerId: '', paymentDate: '', amount: '', paymentMode: 'Bank Transfer',
    remarks: '', status: 'Completed', transactionId: ''
  });

  const [editPaymentIdx, setEditPaymentIdx] = useState(null);
  const [editPaymentForm, setEditPaymentForm] = useState({
    farmerId: '', paymentDate: '', amount: '', paymentMode: 'Bank Transfer',
    remarks: '', status: 'Completed', transactionId: ''
  });

  // Bills State
  const [billForm, setBillForm] = useState({
    billId: '', farmerId: '', billDate: '', dueDate: '', amount: '',
    description: '', status: 'Unpaid', category: 'Milk Purchase'
  });

  const [editBillIdx, setEditBillIdx] = useState(null);
  const [editBillForm, setEditBillForm] = useState({
    billId: '', farmerId: '', billDate: '', dueDate: '', amount: '',
    description: '', status: 'Unpaid', category: 'Milk Purchase'
  });

  // Validation Errors
  const [farmerIdError, setFarmerIdError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [billIdError, setBillIdError] = useState('');

  // Payment handlers with validation - BACKEND INTEGRATION
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setPaymentForm({ ...paymentForm, [name]: value });
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (paymentForm.farmerId && paymentForm.paymentDate && paymentForm.amount &&
        paymentForm.paymentMode && !farmerIdError && !amountError) {
      try {
        const newPayment = {
          ...paymentForm,
          transactionId: paymentForm.transactionId || `TXN${Date.now()}`
        };
        await addPaymentToDB(newPayment);
        setPaymentForm({ 
          farmerId: '', paymentDate: '', amount: '', paymentMode: 'Bank Transfer', 
          remarks: '', status: 'Completed', transactionId: '' 
        });
        setFarmerIdError('');
        setAmountError('');
      } catch (error) {
        console.error('Error adding payment:', error);
        alert('Error adding payment: ' + error.message);
      }
    }
  };

  const handleDeletePayment = async (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment? This action cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      const paymentId = paymentsFromDB[idx].id;
      await deletePaymentFromDB(paymentId);
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Error deleting payment: ' + error.message);
    }
  };

  const handleEditPayment = (idx) => {
    setEditPaymentIdx(idx);
    setEditPaymentForm(paymentsFromDB[idx]);
    setFarmerIdError('');
    setAmountError('');
  };

  const handleEditPaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setEditPaymentForm({ ...editPaymentForm, [name]: value });
  };

  const handleEditPaymentRadio = (e) => setEditPaymentForm({ ...editPaymentForm, paymentMode: e.target.value });

  const handleSaveEditPayment = async () => {
    if (editPaymentIdx !== null && !farmerIdError && !amountError) {
      try {
        const paymentId = paymentsFromDB[editPaymentIdx].id;
        await updatePaymentInDB(paymentId, editPaymentForm);
        setEditPaymentIdx(null);
      } catch (error) {
        console.error('Error updating payment:', error);
        alert('Error updating payment: ' + error.message);
      }
    }
  };

  // Bill handlers with validation - BACKEND INTEGRATION
  const handleBillChange = (e) => {
    const { name, value } = e.target;
    if (name === 'billId') {
      if (!BILL_ID_REGEX.test(value)) setBillIdError('Format: BIL0001 (3 letters + 4 digits)');
      else setBillIdError('');
    }
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setBillForm({ ...billForm, [name]: value });
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    if (billForm.billId && billForm.farmerId && billForm.billDate && billForm.dueDate &&
        billForm.amount && billForm.description && !billIdError && !farmerIdError && !amountError) {
      try {
        await addBillToDB({ ...billForm });
        setBillForm({ 
          billId: '', farmerId: '', billDate: '', dueDate: '', amount: '', 
          description: '', status: 'Unpaid', category: 'Milk Purchase' 
        });
        setBillIdError('');
        setFarmerIdError('');
        setAmountError('');
      } catch (error) {
        console.error('Error adding bill:', error);
        alert('Error adding bill: ' + error.message);
      }
    }
  };

  const handleDeleteBill = async (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bill? This action cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      const billId = billsFromDB[idx].id;
      await deleteBillFromDB(billId);
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Error deleting bill: ' + error.message);
    }
  };

  const handleEditBill = (idx) => {
    setEditBillIdx(idx);
    setEditBillForm(billsFromDB[idx]);
    setBillIdError('');
    setFarmerIdError('');
    setAmountError('');
  };

  const handleEditBillChange = (e) => {
    const { name, value } = e.target;
    if (name === 'billId') {
      if (!BILL_ID_REGEX.test(value)) setBillIdError('Format: BIL0001 (3 letters + 4 digits)');
      else setBillIdError('');
    }
    if (name === 'farmerId') {
      if (!FARMER_ID_REGEX.test(value)) setFarmerIdError('ID must start with letters and end with 4 digits');
      else setFarmerIdError('');
    }
    if (name === 'amount') {
      if (!NUMERIC_REGEX.test(value)) setAmountError('Only numbers allowed');
      else setAmountError('');
    }
    setEditBillForm({ ...editBillForm, [name]: value });
  };

  const handleSaveEditBill = async () => {
    if (editBillIdx !== null && !billIdError && !farmerIdError && !amountError) {
      try {
        const billId = billsFromDB[editBillIdx].id;
        await updateBillInDB(billId, editBillForm);
        setEditBillIdx(null);
      } catch (error) {
        console.error('Error updating bill:', error);
        alert('Error updating bill: ' + error.message);
      }
    }
  };

  // Calculate statistics - BACKEND DATA
  const totalPayments = paymentsFromDB.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
  const pendingPayments = paymentsFromDB.filter(p => p.status === 'Pending').length;
  const completedPayments = paymentsFromDB.filter(p => p.status === 'Completed').length;
  const totalBills = billsFromDB.reduce((sum, b) => sum + parseFloat(b.amount || '0'), 0);
  const unpaidBills = billsFromDB.filter(b => b.status === 'Unpaid').length;
  const overdueBills = billsFromDB.filter(b => b.status === 'Overdue').length;

  // Chart data - BACKEND DATA
  const paymentModeData = PAYMENT_MODES.map(mode => ({
    mode,
    count: paymentsFromDB.filter(p => p.paymentMode === mode).length,
    amount: paymentsFromDB.filter(p => p.paymentMode === mode).reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
  }));

  const billCategoryData = BILL_CATEGORIES.map(category => ({
    category,
    amount: billsFromDB.filter(b => b.category === category).reduce((sum, b) => sum + parseFloat(b.amount || '0'), 0)
  }));

  const tabLabels = [
    { label: 'Payment Management', icon: <PaymentIcon /> },
    { label: 'Bills & Invoices', icon: <ReceiptIcon /> },
    { label: 'Analytics', icon: <AssessmentIcon /> }
  ];

  // Show loading state
  if (loading || paymentsLoading || billsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading payment data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 0, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Purple Header Section - EXACT FROM SCREENSHOT */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)', 
        padding: '40px 24px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <PaymentIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Payment Management
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
          Comprehensive payment and billing management
        </Typography>
      </Box>

      {/* Show error if exists */}
      {error && (
        <Alert severity="warning" sx={{ mb: 2, mx: 3 }}>
          Database connection issue: {error}. Using fallback data.
        </Alert>
      )}

      {/* Statistics Cards - EXACT COLORS FROM SCREENSHOT */}
      <Box sx={{ px: 3, mt: 2, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
              width: '100%',
              maxWidth: '280px',
              mx: 'auto'
            }}>
              <CardContent sx={{ py: 2.5,width: 250, height: 200 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                  ₹{totalPayments.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>Total Payments</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(255, 152, 0, 0.3)'
            }}>
              <CardContent sx={{ py: 2.5,width: 250, height: 200 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <HistoryIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                  {pendingPayments}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>Pending Payments</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)'
            }}>
              <CardContent sx={{ py: 2.5,width: 250, height: 200}}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <ReceiptIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                  ₹{totalBills.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>Total Bills</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(244, 67, 54, 0.3)'
            }}>
              <CardContent sx={{ py: 2.5,width: 250, height: 200 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                  <TrendingDownIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                  {overdueBills}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>Overdue Bills</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Custom Tabs - STYLED LIKE SCREENSHOT */}
      <Box sx={{ px: 3, mt: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          {tabLabels.map((tabObj, idx) => (
            <Button
              key={idx}
              onClick={() => setTab(idx)}
              sx={{
                borderRadius: '25px',
                backgroundColor: tab === idx ? '#8e24aa' : 'transparent',
                color: tab === idx ? '#fff' : '#8e24aa',
                border: '2px solid #8e24aa',
                textTransform: 'none',
                fontWeight: 'bold',
                minWidth: '160px',
                margin: '0 8px',
                padding: '12px 24px',
                '&:hover': { 
                  backgroundColor: tab === idx ? '#7b1fa2' : 'rgba(142, 36, 170, 0.1)' 
                }
              }}
              startIcon={tabObj.icon}
            >
              {tabObj.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ px: 3 }}>
        {/* Payment Management Tab */}
        {tab === 0 && (
          <>
            {/* Add Payment Form - STYLED LIKE SCREENSHOT */}
            <Paper sx={{ 
              p: 4, 
              mb: 3, 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#8e24aa', mr: 2 }}>
                  <PaymentIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Add Payment
                </Typography>
              </Box>
              
              <form onSubmit={handleAddPayment}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Farmer ID *"
                      name="farmerId"
                      value={paymentForm.farmerId}
                      onChange={handlePaymentChange}
                      error={!!farmerIdError}
                      helperText={farmerIdError || "Format: ABC1234 (letters + 4 digits)"}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {farmers.map(farmer => (
                        <MenuItem key={farmer.id} value={farmer.id}>
                          {farmer.id} - {farmer.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Payment Date *"
                      name="paymentDate"
                      value={paymentForm.paymentDate}
                      onChange={handlePaymentChange}
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amount (INR) *"
                      name="amount"
                      value={paymentForm.amount}
                      onChange={handlePaymentChange}
                      error={!!amountError}
                      helperText={amountError}
                      placeholder="₹15000"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Transaction ID"
                      name="transactionId"
                      value={paymentForm.transactionId}
                      onChange={handlePaymentChange}
                      placeholder="Auto-generated if empty"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  <Grid item xs={12} >
                    <TextField
  select
  label="Payment Mode"
  name="paymentMode"
  value={paymentForm.paymentMode}
  onChange={handlePaymentChange}
  fullWidth
  required
  sx={{ borderRadius: 2 }}
>
  {PAYMENT_MODES.map(mode => (
    <MenuItem key={mode} value={mode}>
      {mode}
    </MenuItem>
  ))}
</TextField>

                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      name="status"
                      value={paymentForm.status}
                      onChange={handlePaymentChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PAYMENT_STATUS.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={1}
                      label="Remarks"
                      name="remarks"
                      value={paymentForm.remarks}
                      onChange={handlePaymentChange}
                      placeholder="Enter  remarks..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      disabled={paymentsLoading}
                      sx={{ 
                        borderRadius: 3, 
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7b1fa2 0%, #8e24aa 100%)',
                        }
                      }}
                    >
                      {paymentsLoading ? <CircularProgress size={20} color="inherit" /> : 'ADD PAYMENT'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Payment Records Table - STYLED LIKE SCREENSHOT */}
            <Paper sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#8e24aa', mr: 2 }}>
                    <HistoryIcon />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Payment Records
                  </Typography>
                </Box>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Farmer ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Mode</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Transaction ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentsFromDB.map((payment, idx) => (
                      <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <TableCell>
                          <Chip 
                            label={payment.farmerId} 
                            color="primary" 
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>{formatDateTime(payment.paymentDate)}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                          ₹{payment.amount}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.paymentMode} 
                            color="secondary"
                            sx={{ borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status} 
                            color={payment.status === 'Completed' ? 'success' : payment.status === 'Pending' ? 'warning' : 'error'}
                            sx={{ borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '13px' }}>
                          {payment.transactionId}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleEditPayment(idx)} 
                            sx={{ 
                              borderRadius: 2, 
                              mr: 1,
                              color: '#1976d2',
                              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeletePayment(idx)} 
                            sx={{ 
                              borderRadius: 2,
                              color: '#d32f2f',
                              '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paymentsFromDB.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <PaymentIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                              No payments recorded
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Add your first payment using the form above
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Edit Payment Dialog - STYLED LIKE SCREENSHOT */}
            <Dialog 
              open={editPaymentIdx !== null} 
              onClose={() => setEditPaymentIdx(null)} 
              maxWidth="md" 
              fullWidth
              PaperProps={{
                sx: { borderRadius: 3 }
              }}
            >
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}>
                <EditIcon sx={{ mr: 1 }} />
                Edit Payment
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Farmer ID *"
                      name="farmerId"
                      value={editPaymentForm.farmerId}
                      onChange={handleEditPaymentChange}
                      error={!!farmerIdError}
                      helperText={farmerIdError}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {farmers.map(farmer => (
                        <MenuItem key={farmer.id} value={farmer.id}>
                          {farmer.id} - {farmer.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Payment Date"
                      name="paymentDate"
                      value={editPaymentForm.paymentDate}
                      onChange={handleEditPaymentChange}
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amount (₹)"
                      name="amount"
                      value={editPaymentForm.amount}
                      onChange={handleEditPaymentChange}
                      error={!!amountError}
                      helperText={amountError}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Transaction ID"
                      name="transactionId"
                      value={editPaymentForm.transactionId}
                      onChange={handleEditPaymentChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
  select
  label="Payment Mode"
  name="paymentMode"
  value={editPaymentForm.paymentMode}
  onChange={handleEditPaymentChange}
  fullWidth
  required
  sx={{ borderRadius: 2 }}
>
  {PAYMENT_MODES.map(mode => (
    <MenuItem key={mode} value={mode}>
      {mode}
    </MenuItem>
  ))}
</TextField>

                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      name="status"
                      value={editPaymentForm.status}
                      onChange={handleEditPaymentChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {PAYMENT_STATUS.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={1}
                      label="Remarks"
                      name="remarks"
                      value={editPaymentForm.remarks}
                      onChange={handleEditPaymentChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button 
                  onClick={() => setEditPaymentIdx(null)} 
                  variant="outlined" 
                  sx={{ borderRadius: 2, mr: 2 }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEditPayment} 
                  variant="contained" 
                  disabled={paymentsLoading}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)'
                  }}
                >
                  {paymentsLoading ? <CircularProgress size={20} /> : 'Save Changes'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Bills & Invoices Tab */}
        {tab === 1 && (
          <>
            <Paper sx={{ 
              p: 4, 
              mb: 3, 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#8e24aa', mr: 2 }}>
                  <ReceiptIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Add Bill
                </Typography>
              </Box>
              <form onSubmit={handleAddBill}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bill ID"
                      name="billId"
                      value={billForm.billId}
                      onChange={handleBillChange}
                      error={!!billIdError}
                      helperText={billIdError}
                      placeholder="BIL0001"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Farmer"
                      name="farmerId"
                      value={billForm.farmerId}
                      onChange={handleBillChange}
                      error={!!farmerIdError}
                      helperText={farmerIdError}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {farmers.map(farmer => (
                        <MenuItem key={farmer.id} value={farmer.id}>
                          {farmer.id} - {farmer.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Bill Date"
                      name="billDate"
                      value={billForm.billDate}
                      onChange={handleBillChange}
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Due Date"
                      name="dueDate"
                      value={billForm.dueDate}
                      onChange={handleBillChange}
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amount (₹)"
                      name="amount"
                      value={billForm.amount}
                      onChange={handleBillChange}
                      error={!!amountError}
                      helperText={amountError}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Category"
                      name="category"
                      value={billForm.category}
                      onChange={handleBillChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {BILL_CATEGORIES.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      name="status"
                      value={billForm.status}
                      onChange={handleBillChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {BILL_STATUS.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={1}
                      label="Description"
                      name="description"
                      value={billForm.description}
                      onChange={handleBillChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      disabled={billsLoading}
                      sx={{ 
                        borderRadius: 3, 
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)',
                        fontWeight: 'bold',
                        textTransform: 'none'
                      }}
                    >
                      {billsLoading ? <CircularProgress size={20} /> : 'ADD BILL'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            <Paper sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#8e24aa', mr: 2 }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Bills & Invoices
                  </Typography>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Bill ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Farmer ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billsFromDB.map((bill, idx) => (
                      <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <TableCell>
                          <Chip label={bill.billId} color="primary" variant="outlined" sx={{ borderRadius: 2 }} />
                        </TableCell>
                        <TableCell>{bill.farmerId}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32' }}>₹{bill.amount}</TableCell>
                        <TableCell>{formatDateTime(bill.dueDate)}</TableCell>
                        <TableCell>
                          <Chip label={bill.category} color="secondary" sx={{ borderRadius: 2 }} />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={bill.status} 
                            color={bill.status === 'Paid' ? 'success' : bill.status === 'Unpaid' ? 'warning' : 'error'} 
                            sx={{ borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditBill(idx)} sx={{ borderRadius: 2, mr: 1 }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteBill(idx)} sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {billsFromDB.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ReceiptIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                              No bills created
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Edit Bill Dialog */}
            <Dialog open={editBillIdx !== null} onClose={() => setEditBillIdx(null)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}>
                <EditIcon sx={{ mr: 1 }} />
                Edit Bill
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bill ID"
                      name="billId"
                      value={editBillForm.billId}
                      onChange={handleEditBillChange}
                      error={!!billIdError}
                      helperText={billIdError}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Farmer"
                      name="farmerId"
                      value={editBillForm.farmerId}
                      onChange={handleEditBillChange}
                      error={!!farmerIdError}
                      helperText={farmerIdError}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {farmers.map(farmer => (
                        <MenuItem key={farmer.id} value={farmer.id}>
                          {farmer.id} - {farmer.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Bill Date"
                      name="billDate"
                      value={editBillForm.billDate}
                      onChange={handleEditBillChange}
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Due Date"
                      name="dueDate"
                      value={editBillForm.dueDate}
                      onChange={handleEditBillChange}
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amount (₹)"
                      name="amount"
                      value={editBillForm.amount}
                      onChange={handleEditBillChange}
                      error={!!amountError}
                      helperText={amountError}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Category"
                      name="category"
                      value={editBillForm.category}
                      onChange={handleEditBillChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {BILL_CATEGORIES.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      name="status"
                      value={editBillForm.status}
                      onChange={handleEditBillChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {BILL_STATUS.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      name="description"
                      value={editBillForm.description}
                      onChange={handleEditBillChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setEditBillIdx(null)} variant="outlined" sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEditBill} 
                  variant="contained" 
                  disabled={billsLoading}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)'
                  }}
                >
                  {billsLoading ? <CircularProgress size={20} /> : 'Save Changes'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Analytics Tab */}
        {tab === 2 && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                    Payment Methods Distribution
                  </Typography>
                  <ResponsiveContainer width={500} height={300}>
                    <PieChart>
                      <Pie
                        data={paymentModeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({mode, count}) => `${mode}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {paymentModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                    Bill Categories
                  </Typography>
                  <ResponsiveContainer width={450} height={300}>
                    <BarChart data={billCategoryData}>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#8e24aa" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Payments;
