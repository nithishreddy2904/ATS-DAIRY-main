import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  Grid, Card, CardContent, Box, Stack, Avatar, Chip, LinearProgress,
  FormControl, InputLabel, Select, MenuItem, TextField, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton
} from '@mui/material';
import {
  Assessment, PictureAsPdf, TableChart, BarChart, TrendingUp,
  People, LocalShipping, Store, Nature, WorkOutline, AttachMoney,
  Download, Close, DateRange, FilterList
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportGenerator = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const {
    farmers, suppliers, milkEntries, inventoryItems, sales, qualityTests,
    employees, complianceRecords, certifications, audits, processingUnits,
    productionBatches, calculateEmployeeSatisfaction, calculateSustainabilityIndex,
    calculateProcessingEfficiency
  } = useAppContext();

  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Business Report', icon: <Assessment />, description: 'Complete overview of all operations' },
    { value: 'farmers', label: 'Farmers & Network Report', icon: <People />, description: 'Farmer registration and network analytics' },
    { value: 'production', label: 'Production & Quality Report', icon: <BarChart />, description: 'Milk production and quality metrics' },
    { value: 'financial', label: 'Financial Performance Report', icon: <AttachMoney />, description: 'Revenue, sales and financial analytics' },
    { value: 'compliance', label: 'Compliance & Sustainability Report', icon: <Nature />, description: 'Compliance status and sustainability metrics' },
    { value: 'inventory', label: 'Inventory & Supply Chain Report', icon: <Store />, description: 'Inventory levels and supplier performance' },
    { value: 'workforce', label: 'Workforce Management Report', icon: <WorkOutline />, description: 'Employee satisfaction and performance' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: <PictureAsPdf /> },
    { value: 'excel', label: 'Excel Spreadsheet', icon: <TableChart /> }
  ];

  const dateRangeOptions = [
    { value: 'daily', label: 'Daily (Last 7 days)' },
    { value: 'weekly', label: 'Weekly (Last 4 weeks)' },
    { value: 'monthly', label: 'Monthly (Last 6 months)' },
    { value: 'quarterly', label: 'Quarterly (Last 4 quarters)' },
    { value: 'yearly', label: 'Yearly (Last 3 years)' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const getFilteredData = (data, dateField = 'date') => {
    if (!startDate || !endDate) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });
  };

  const generatePDFReport = (reportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text('Dairy Operations Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Report Type: ${reportTypes.find(r => r.value === reportType)?.label}`, pageWidth / 2, 40, { align: 'center' });
    
    let yPosition = 60;
    
    // Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 15;
    
    const summaryData = [
      ['Total Farmers', farmers.length.toString()],
      ['Active Farmers', farmers.filter(f => f.status === 'Active').length.toString()],
      ['Total Suppliers', suppliers.length.toString()],
      ['Processing Efficiency', `${calculateProcessingEfficiency}%`],
      ['Sustainability Index', `${calculateSustainabilityIndex}%`],
      ['Employee Satisfaction', `${calculateEmployeeSatisfaction}%`]
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243] },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
    
    // Report-specific content
    switch (reportType) {
      case 'comprehensive':
        generateComprehensiveContent(doc, yPosition);
        break;
      case 'farmers':
        generateFarmersContent(doc, yPosition);
        break;
      case 'production':
        generateProductionContent(doc, yPosition);
        break;
      case 'financial':
        generateFinancialContent(doc, yPosition);
        break;
      case 'compliance':
        generateComplianceContent(doc, yPosition);
        break;
      case 'inventory':
        generateInventoryContent(doc, yPosition);
        break;
      case 'workforce':
        generateWorkforceContent(doc, yPosition);
        break;
      default:
        break;
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
      doc.text('Dairy Management System', 20, doc.internal.pageSize.height - 10);
    }
    
    return doc;
  };

  const generateComprehensiveContent = (doc, startY) => {
    let yPos = startY;
    
    // Add new page if needed
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Detailed Analytics', 20, yPos);
    yPos += 15;
    
    // Farmers Analysis
    const farmersData = [
      ['Total Registered', farmers.length.toString()],
      ['Active Status', farmers.filter(f => f.status === 'Active').length.toString()],
      ['Total Cattle', farmers.reduce((sum, f) => sum + parseInt(f.cattleCount || '0'), 0).toString()],
      ['Average Cattle per Farm', (farmers.reduce((sum, f) => sum + parseInt(f.cattleCount || '0'), 0) / farmers.length || 0).toFixed(1)]
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [['Farmers Metrics', 'Value']],
      body: farmersData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: 20, right: 20 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Production Analysis
    const productionData = [
      ['Total Milk Entries', milkEntries.length.toString()],
      ['Total Milk Collected', `${milkEntries.reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0).toFixed(1)}L`],
      ['Quality Tests Conducted', qualityTests.length.toString()],
      ['Average Quality Grade', getAverageQualityGrade()]
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [['Production Metrics', 'Value']],
      body: productionData,
      theme: 'striped',
      headStyles: { fillColor: [255, 152, 0] },
      margin: { left: 20, right: 20 }
    });
  };

  const generateFarmersContent = (doc, startY) => {
    let yPos = startY;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Farmers Network Analysis', 20, yPos);
    yPos += 15;
    
    const farmersTableData = farmers.slice(0, 10).map(farmer => [
      farmer.id,
      farmer.name,
      farmer.cattleCount,
      farmer.status,
      farmer.joinDate ? new Date(farmer.joinDate).toLocaleDateString() : 'N/A'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Farmer ID', 'Name', 'Cattle', 'Status', 'Join Date']],
      body: farmersTableData,
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243] },
      margin: { left: 20, right: 20 }
    });
  };

  const generateProductionContent = (doc, startY) => {
    let yPos = startY;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Production & Quality Analysis', 20, yPos);
    yPos += 15;
    
    const productionTableData = milkEntries.slice(0, 10).map(entry => [
      entry.farmerId,
      entry.date,
      `${entry.quantity}L`,
      entry.shift,
      entry.quality
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Farmer ID', 'Date', 'Quantity', 'Shift', 'Quality']],
      body: productionTableData,
      theme: 'grid',
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: 20, right: 20 }
    });
  };

  const generateFinancialContent = (doc, startY) => {
    let yPos = startY;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Financial Performance Analysis', 20, yPos);
    yPos += 15;
    
    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
    const avgSale = totalRevenue / sales.length || 0;
    
    const financialData = [
      ['Total Sales Transactions', sales.length.toString()],
      ['Total Revenue', `₹${totalRevenue.toLocaleString()}`],
      ['Average Sale Value', `₹${avgSale.toFixed(2)}`],
      ['Top Retailer', sales.length > 0 ? sales[0].retailer : 'N/A']
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [['Financial Metric', 'Value']],
      body: financialData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: 20, right: 20 }
    });
  };

  const generateComplianceContent = (doc, startY) => {
    let yPos = startY;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Compliance & Sustainability Report', 20, yPos);
    yPos += 15;
    
    const complianceData = [
      ['Total Compliance Records', complianceRecords.length.toString()],
      ['Compliant Records', complianceRecords.filter(r => r.status === 'Compliant').length.toString()],
      ['Active Certifications', certifications.filter(c => c.status === 'Active').length.toString()],
      ['Completed Audits', audits.filter(a => a.status === 'Completed').length.toString()],
      ['Sustainability Index', `${calculateSustainabilityIndex}%`]
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [['Compliance Metric', 'Value']],
      body: complianceData,
      theme: 'striped',
      headStyles: { fillColor: [139, 195, 74] },
      margin: { left: 20, right: 20 }
    });
  };

  const generateInventoryContent = (doc, startY) => {
    let yPos = startY;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Inventory & Supply Chain Report', 20, yPos);
    yPos += 15;
    
    const inventoryTableData = inventoryItems.slice(0, 10).map(item => [
      item.code,
      item.name,
      item.category,
      `${item.quantity} ${item.unit}`,
      item.status
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Code', 'Item Name', 'Category', 'Quantity', 'Status']],
      body: inventoryTableData,
      theme: 'grid',
      headStyles: { fillColor: [156, 39, 176] },
      margin: { left: 20, right: 20 }
    });
  };

  const generateWorkforceContent = (doc, startY) => {
    let yPos = startY;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Workforce Management Report', 20, yPos);
    yPos += 15;
    
    const workforceData = [
      ['Total Employees', employees.length.toString()],
      ['Active Employees', employees.filter(e => e.status === 'Active').length.toString()],
      ['Employee Satisfaction', `${calculateEmployeeSatisfaction}%`],
      ['Average Salary', `₹${(employees.reduce((sum, e) => sum + parseFloat(e.salary || 0), 0) / employees.length || 0).toFixed(0)}`]
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [['Workforce Metric', 'Value']],
      body: workforceData,
      theme: 'striped',
      headStyles: { fillColor: [121, 85, 72] },
      margin: { left: 20, right: 20 }
    });
  };

  const generateExcelReport = () => {
    const workbook = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Farmers', farmers.length],
      ['Active Farmers', farmers.filter(f => f.status === 'Active').length],
      ['Total Suppliers', suppliers.length],
      ['Processing Efficiency', `${calculateProcessingEfficiency}%`],
      ['Sustainability Index', `${calculateSustainabilityIndex}%`],
      ['Employee Satisfaction', `${calculateEmployeeSatisfaction}%`],
      ['Total Revenue', `₹${sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0).toLocaleString()}`]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Farmers Sheet
    if (reportType === 'comprehensive' || reportType === 'farmers') {
      const farmersData = [
        ['Farmer ID', 'Name', 'Phone', 'Email', 'Cattle Count', 'Status', 'Join Date'],
        ...farmers.map(f => [f.id, f.name, f.phone, f.email, f.cattleCount, f.status, f.joinDate])
      ];
      const farmersSheet = XLSX.utils.aoa_to_sheet(farmersData);
      XLSX.utils.book_append_sheet(workbook, farmersSheet, 'Farmers');
    }
    
    // Production Sheet
    if (reportType === 'comprehensive' || reportType === 'production') {
      const productionData = [
        ['Farmer ID', 'Date', 'Quantity (L)', 'Shift', 'Quality'],
        ...milkEntries.map(e => [e.farmerId, e.date, e.quantity, e.shift, e.quality])
      ];
      const productionSheet = XLSX.utils.aoa_to_sheet(productionData);
      XLSX.utils.book_append_sheet(workbook, productionSheet, 'Production');
    }
    
    // Sales Sheet
    if (reportType === 'comprehensive' || reportType === 'financial') {
      const salesData = [
        ['Date', 'Retailer', 'Amount (₹)'],
        ...sales.map(s => [s.date, s.retailer, s.amount])
      ];
      const salesSheet = XLSX.utils.aoa_to_sheet(salesData);
      XLSX.utils.book_append_sheet(workbook, salesSheet, 'Sales');
    }
    
    return workbook;
  };

  const getAverageQualityGrade = () => {
    const gradePoints = { 'A+': 4, 'A': 3, 'B': 2, 'C': 1, 'D': 0 };
    const gradeNames = ['D', 'C', 'B', 'A', 'A+'];
    
    if (qualityTests.length === 0) return 'N/A';
    
    const avgPoints = qualityTests.reduce((sum, test) => {
      return sum + (gradePoints[test.overallGrade] || 0);
    }, 0) / qualityTests.length;
    
    return gradeNames[Math.round(avgPoints)] || 'N/A';
  };

  const handleGenerateReport = async () => {
    if (!reportType) return;
    
    setGenerating(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const reportName = `${reportTypes.find(r => r.value === reportType)?.label.replace(/\s+/g, '_')}_${timestamp}`;
      
      if (format === 'pdf') {
        const doc = generatePDFReport();
        doc.save(`${reportName}.pdf`);
      } else {
        const workbook = generateExcelReport();
        XLSX.writeFile(workbook, `${reportName}.xlsx`);
      }
      
      setGenerating(false);
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      setGenerating(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: isDark ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center',
        borderRadius: '12px 12px 0 0'
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
          <Assessment />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">Generate Business Report</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Create comprehensive reports from your dairy operations data
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Report Type Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ mr: 1, color: 'primary.main' }} />
              Select Report Type
            </Typography>
            <Grid container spacing={2}>
              {reportTypes.map((type) => (
                <Grid item xs={12} sm={6} key={type.value}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: reportType === type.value ? '2px solid' : '1px solid',
                      borderColor: reportType === type.value ? 'primary.main' : 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                    onClick={() => setReportType(type.value)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ 
                          bgcolor: reportType === type.value ? 'primary.main' : 'grey.300',
                          color: reportType === type.value ? 'white' : 'grey.600'
                        }}>
                          {type.icon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {type.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {type.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Date Range Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                startAdornment={<DateRange sx={{ mr: 1, color: 'action.active' }} />}
              >
                {dateRangeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Format Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Output Format</InputLabel>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                {formatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {option.icon}
                      <Typography>{option.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}

          {/* Report Preview */}
          {reportType && (
            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Report Preview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          {farmers.length}
                        </Typography>
                        <Typography variant="caption">Total Farmers</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          {suppliers.length}
                        </Typography>
                        <Typography variant="caption">Total Suppliers</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {milkEntries.length}
                        </Typography>
                        <Typography variant="caption">Milk Entries</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                          {sales.length}
                        </Typography>
                        <Typography variant="caption">Sales Records</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Generation Progress */}
          {generating && (
            <Grid item xs={12}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography variant="body1" color="primary.main" fontWeight="bold">
                  Generating your report... Please wait
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Processing data and creating {format.toUpperCase()} file
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ borderRadius: 2 }}
          disabled={generating}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleGenerateReport}
          variant="contained"
          disabled={!reportType || generating}
          startIcon={generating ? <LinearProgress size={20} /> : <Download />}
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976d2 30%, #0288d1 90%)',
            }
          }}
        >
          {generating ? 'Generating...' : 'Generate Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReportGenerator.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReportGenerator;
