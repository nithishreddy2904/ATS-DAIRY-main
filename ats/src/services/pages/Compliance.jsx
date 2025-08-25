import  { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, TextField, Button,
   MenuItem, Stack, Alert, LinearProgress,  FormControl,
  InputLabel, Select, FormHelperText, Switch, FormControlLabel
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import PendingIcon from '@mui/icons-material/Pending';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SecurityIcon from '@mui/icons-material/Security';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../../context/AppContext';

// Enhanced validation patterns and constants
const CERTIFICATE_ID_REGEX = /^[A-Z]{3}[0-9]{6}$/;
const COMPLIANCE_TYPES = [
  'FSSAI License', 'ISO Certification', 'HACCP', 'Environmental Clearance', 
  'Labor Compliance', 'Tax Compliance', 'Fire Safety', 'Pollution Control',
  'Quality Management', 'Food Safety', 'Waste Management', 'Energy Compliance'
];

const COMPLIANCE_STATUS = ['Compliant', 'Non-Compliant', 'Pending', 'Under Review', 'Expired', 'Renewed'];
const PRIORITY_LEVELS = ['High', 'Medium', 'Low', 'Critical'];
const CERTIFICATION_STATUS = ['Active', 'Expired', 'Pending Renewal', 'Under Process', 'Suspended', 'Cancelled'];
const AUDIT_TYPES = [
  'Internal Audit', 'External Audit', 'Regulatory Inspection', 'Customer Audit', 
  'Supplier Audit', 'Environmental Audit', 'Safety Audit', 'Quality Audit'
];
const AUDIT_STATUS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'];
const DOCUMENT_TYPES = ['License', 'Certificate', 'Report', 'Policy', 'Procedure', 'Record', 'Manual'];
const DOCUMENT_CATEGORIES = [
  'Quality Control', 'Environmental', 'Safety', 'Financial', 'Legal', 
  'Operational', 'Regulatory', 'Training', 'Emergency'
];

const ComplianceCertification = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState(0);


  // Get shared data from context
  
  const {
    auditsFromDB,
    documentsFromDB,
    addAuditToDB,
    addDocumentToDB,
} = useAppContext();

  const {
  complianceRecords,
  certifications,
  addComplianceRecord,
  addCertification,
  calculateSustainabilityIndex
} = useAppContext();

  // Enhanced Compliance Records state with all table columns
  const [complianceForm, setComplianceForm] = useState({
    id: '',
    type: '',
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    completedDate: '',
    assignedTo: '',
    responsibleDepartment: '',
    complianceOfficer: '',
    regulatoryBody: '',
    licenseNumber: '',
    validityPeriod: '',
    renewalDate: '',
    cost: '',
    documents: [],
    remarks: '',
    riskLevel: 'Medium',
    businessImpact: 'Medium'
  });


  // Enhanced Certifications state with all table columns
  const [certificationForm, setCertificationForm] = useState({
    id: '',
    name: '',
    issuingAuthority: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
    status: 'Active',
    renewalRequired: false,
    documentPath: '',
    scope: '',
    accreditationBody: '',
    surveillanceDate: '',
    cost: '',
    validityPeriod: '',
    benefits: '',
    maintenanceRequirements: ''
  });

  

  // Enhanced Audits state with all table columns
  const [auditForm, setAuditForm] = useState({
    id: '',
    auditType: '',
    auditor: '',
    auditFirm: '',
    scheduledDate: '',
    completedDate: '',
    duration: '',
    status: 'Scheduled',
    findings: '',
    correctiveActions: '',
    score: 0,
    auditScope: '',
    auditCriteria: '',
    nonConformities: '',
    recommendations: '',
    followUpDate: '',
    cost: '',
    reportPath: ''
  });

  


  const [documentForm, setDocumentForm] = useState({
    id: '',
    name: '',
    type: '',
    category: '',
    uploadDate: '',
    expiryDate: '',
    status: 'Active',
    size: '',
    version: '1.0',
    uploadedBy: '',
    reviewedBy: '',
    approvedBy: '',
    filePath: '',
    description: ''
  });


  // Validation errors
  const [certificateError, setCertificateError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Enhanced validation function
  const validateForm = (formData, formType) => {
  const errors = {};
  
  switch (formType) {
    case 'compliance':
      if (!formData.type) errors.type = 'Compliance type is required';
      if (!formData.title) errors.title = 'Title is required';
      if (!formData.description) errors.description = 'Description is required';
      if (!formData.dueDate) errors.dueDate = 'Due date is required';
      if (!formData.assignedTo) errors.assignedTo = 'Assigned person is required';
      if (!formData.responsibleDepartment) errors.responsibleDepartment = 'Department is required';
      break;
      
    case 'certification':
      if (!formData.name) errors.name = 'Certification name is required';
      if (!formData.issuingAuthority) errors.issuingAuthority = 'Issuing authority is required';
      if (!formData.certificateNumber) errors.certificateNumber = 'Certificate number is required';
      if (!formData.issueDate) errors.issueDate = 'Issue date is required';
      if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required';
      break;
      
    case 'audit':
      if (!formData.auditType) errors.auditType = 'Audit type is required';
      if (!formData.auditor) errors.auditor = 'Auditor is required';
      if (!formData.scheduledDate) errors.scheduledDate = 'Scheduled date is required';
      if (!formData.auditScope) errors.auditScope = 'Audit scope is required';
      break;
      
    case 'document':
      if (!formData.name) errors.name = 'Document name is required';
      if (!formData.type) errors.type = 'Document type is required';
      if (!formData.category) errors.category = 'Category is required';
      if (!formData.uploadedBy) errors.uploadedBy = 'Uploaded by is required';
      break;
      
    default:
      break;
  }
  
  return errors;
};


  // Tab styling function (kept same as original)
  const getTabStyle = (index, isSelected) => {
    const styles = [
      {
        borderRadius: '25px',
        backgroundColor: isSelected ? '#2196f3' : 'transparent',
        color: isSelected ? '#fff' : '#2196f3',
        border: '2px solid #2196f3',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '140px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#1976d2' : '#e3f2fd' }
      },
      {
        borderRadius: '8px 8px 0 0',
        backgroundColor: isSelected ? '#4caf50' : '#f5f5f5',
        color: isSelected ? '#fff' : '#4caf50',
        border: '1px solid #4caf50',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        minWidth: '130px',
        margin: '0 2px',
        '&:hover': { backgroundColor: isSelected ? '#388e3c' : '#e8f5e9' }
      },
      {
        borderRadius: '12px',
        backgroundColor: isSelected ? '#ff9800' : 'transparent',
        color: isSelected ? '#fff' : '#ff9800',
        border: '2px dashed #ff9800',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '120px',
        margin: '0 6px',
        '&:hover': { backgroundColor: isSelected ? '#f57c00' : '#fff3e0' }
      },
      {
        borderRadius: '20px 20px 20px 4px',
        backgroundColor: isSelected ? '#9c27b0' : '#fff',
        color: isSelected ? '#fff' : '#9c27b0',
        border: '2px solid #9c27b0',
        textTransform: 'none',
        fontWeight: 'bold',
        minWidth: '130px',
        margin: '0 4px',
        '&:hover': { backgroundColor: isSelected ? '#7b1fa2' : '#f3e5f5' }
      }
    ];
    return styles[index] || {};
  };

  // Enhanced Compliance handlers
  const handleComplianceChange = (e) => {
    const { name, value } = e.target;
    setComplianceForm({ ...complianceForm, [name]: value });
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

const handleAddCompliance = async (e) => {
  e.preventDefault();
  const errors = validateForm(complianceForm, 'compliance');
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  try {
    const newCompliance = {
      ...complianceForm,
      id: `COMP${String(complianceRecords.length + 1).padStart(3, '0')}`
    };
    
    await addComplianceRecord(newCompliance);
    
    setComplianceForm({
      id: '',
      type: '',
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '',
      completedDate: '',
      assignedTo: '',
      responsibleDepartment: '',
      complianceOfficer: '',
      regulatoryBody: '',
      licenseNumber: '',
      validityPeriod: '',
      renewalDate: '',
      cost: '',
      documents: [],
      remarks: '',
      riskLevel: 'Medium',
      businessImpact: 'Medium'
    });
    setFormErrors({});
  } catch (error) {
    console.error('Error adding compliance record:', error);
    alert('Error adding compliance record: ' + error.message);
  }
};

  // Enhanced Certification handlers
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'certificateNumber') {
      if (value && !CERTIFICATE_ID_REGEX.test(value)) {
        setCertificateError('Format: ABC123456 (3 letters + 6 digits)');
      } else {
        setCertificateError('');
      }
    }
    
    setCertificationForm({ ...certificationForm, [name]: value });
  };

  const handleAddCertification = async (e) => {
  e.preventDefault();
  const errors = validateForm(certificationForm, 'certification');
  if (Object.keys(errors).length > 0 || certificateError) {
    setFormErrors(errors);
    return;
  }

  try {
    const newCertification = {
      ...certificationForm,
      id: `CERT${String(certifications.length + 1).padStart(3, '0')}`
    };
    
    await addCertification(newCertification);
    
    setCertificationForm({
      id: '',
      name: '',
      issuingAuthority: '',
      certificateNumber: '',
      issueDate: '',
      expiryDate: '',
      status: 'Active',
      renewalRequired: false,
      documentPath: '',
      scope: '',
      accreditationBody: '',
      surveillanceDate: '',
      cost: '',
      validityPeriod: '',
      benefits: '',
      maintenanceRequirements: ''
    });
    setFormErrors({});
  } catch (error) {
    console.error('Error adding certification:', error);
    alert('Error adding certification: ' + error.message);
  }
};

  // Enhanced Audit handlers
  const handleAuditChange = (e) => {
    const { name, value } = e.target;
    setAuditForm({ ...auditForm, [name]: value });
  };

  const handleAddAudit = async (e) => {
    e.preventDefault();
    const errors = validateForm(auditForm, 'audit');
    if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
    }

    try {
        const newAudit = {
            ...auditForm,
            id: `AUD${String(auditsFromDB.length + 1).padStart(3, '0')}`
        };
        await addAuditToDB(newAudit);
        setAuditForm({
            id: '', auditType: '', auditor: '', auditFirm: '', scheduledDate: '', completedDate: '',
            duration: '', status: 'Scheduled', findings: '', correctiveActions: '', score: 0,
            auditScope: '', auditCriteria: '', nonConformities: '', recommendations: '',
            followUpDate: '', cost: '', reportPath: ''
        });
        setFormErrors({});
    } catch (error) {
        console.error('Error adding audit:', error);
        alert('Error adding audit: ' + error.message);
    }
};

  // Enhanced Document handlers
  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setDocumentForm({ ...documentForm, [name]: value });
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    const errors = validateForm(documentForm, 'document');
    if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
    }

    try {
        const newDocument = {
            ...documentForm,
            id: `DOC${String(documentsFromDB.length + 1).padStart(3, '0')}`,
            uploadDate: new Date().toISOString().split('T')[0]
        };
        await addDocumentToDB(newDocument);
        setDocumentForm({
            id: '', name: '', type: '', category: '', uploadDate: '', expiryDate: '',
            status: 'Active', size: '', version: '1.0', uploadedBy: '', reviewedBy: '',
            approvedBy: '', filePath: '', description: ''
        });
        setFormErrors({});
    } catch (error) {
        console.error('Error adding document:', error);
        alert('Error adding document: ' + error.message);
    }
};

  // Calculate statistics
  const totalCompliance = complianceRecords.length;
  const compliantRecords = complianceRecords.filter(c => c.status === 'Compliant').length;
  const pendingCompliance = complianceRecords.filter(c => c.status === 'Pending').length;
  const expiredCertifications = certifications.filter(c => c.status === 'Expired' || c.status === 'Pending Renewal').length;
  const sustainabilityIndex = calculateSustainabilityIndex;

  const tabLabels = [
    { label: 'Compliance Records', icon: <AssignmentIcon /> },
    { label: 'Certifications', icon: <VerifiedIcon /> },
    { label: 'Audits & Inspections', icon: <SecurityIcon /> },
    { label: 'Document Management', icon: <DescriptionIcon /> }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Enhanced Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, ${isDark ? '#1e3a8a' : '#3b82f6'} 0%, ${isDark ? '#1e40af' : '#60a5fa'} 100%)` }}>
        <Box sx={{ display: 'flex',ml: 28, alignItems: 'center', mb: 2 }}>
          {tabLabels[tab].icon}
          <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3.5rem',ml: 2, color: '#fff', fontWeight: 'bold' }}>
            {tabLabels[tab].label}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ textAlign: 'center', fontSize: '1.0rem',color: '#e2e8f0', mb: 1 }}>
          Sustainability Index: {sustainabilityIndex}% | Calculated from compliance parameters
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={sustainabilityIndex} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: sustainabilityIndex >= 80 ? '#10b981' : sustainabilityIndex >= 60 ? '#f59e0b' : '#ef4444'
            }
          }} 
        />
      </Paper>

      {/* Enhanced Compliance Alerts */}
      {(pendingCompliance > 0 || expiredCertifications > 0) && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {expiredCertifications > 0 && (
            <Alert severity="error" icon={<WarningIcon />} sx={{ borderRadius: 2 }}>
              <strong>Urgent Action Required:</strong> {expiredCertifications} certification(s) require immediate attention
            </Alert>
          )}
          {pendingCompliance > 0 && (
            <Alert severity="warning" icon={<PendingIcon />} sx={{ borderRadius: 2 }}>
              <strong>Pending Tasks:</strong> {pendingCompliance} compliance task(s) are pending
            </Alert>
          )}
        </Stack>
      )}

      {/* Enhanced Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 3, width: '250px', height: '150px', background: `linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)` }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>{totalCompliance}</Typography>
            <Typography variant="h6" sx={{ color: '#e2e8f0' }}>Total Compliance</Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>All records</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 3, width: '250px', height: '150px', background: `linear-gradient(135deg, #10b981 0%, #34d399 100%)` }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>{compliantRecords}</Typography>
            <Typography variant="h6" sx={{ color: '#e2e8f0' }}>Compliant</Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>Up to date</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 3, width: '250px', height: '150px', background: `linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)` }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>{pendingCompliance}</Typography>
            <Typography variant="h6" sx={{ color: '#e2e8f0' }}>Pending</Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>Need attention</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 3, width: '250px', height: '150px', background: `linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)` }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>{certifications.length}</Typography>
            <Typography variant="h6" sx={{ color: '#e2e8f0' }}>Certifications</Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>Active & pending</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Custom Tabs */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, background: `linear-gradient(90deg, ${isDark ? '#374151' : '#f8fafc'} 0%, ${isDark ? '#4b5563' : '#e2e8f0'} 100%)` }}>
          {tabLabels.map((tabObj, idx) => (
            <Button
              key={idx}
              onClick={() => setTab(idx)}
              sx={getTabStyle(idx, tab === idx)}
              startIcon={tabObj.icon}
            >
              {tabObj.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Enhanced Compliance Records Tab */}
      {tab === 0 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center',fontWeight: '900', fontSize: '1.8rem' }}>
              <AssignmentIcon sx={{ mr: 1, backgroundColor: '#3b82f6', color: '#fff', padding: '2px', borderRadius: '50%' }} />
              Add Compliance Record
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              These records directly affect Sustainability Index calculation
            </Typography>
            
            <form onSubmit={handleAddCompliance}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.type}>
                    <InputLabel>Compliance Type *</InputLabel>
                    <Select
                    sx={{width: '170px'}}
                      name="type"
                      value={complianceForm.type}
                      onChange={handleComplianceChange}
                      label="Compliance Type *"
                    >
                      {COMPLIANCE_TYPES.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                    {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Title *"
                    value={complianceForm.title}
                    onChange={handleComplianceChange}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="description"
                    label="Description *"
                    value={complianceForm.description}
                    onChange={handleComplianceChange}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={complianceForm.priority}
                      onChange={handleComplianceChange}
                      label="Priority"
                    >
                      {PRIORITY_LEVELS.map(priority => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={complianceForm.status}
                      onChange={handleComplianceChange}
                      label="Status"
                    >
                      {COMPLIANCE_STATUS.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Risk Level</InputLabel>
                    <Select
                      name="riskLevel"
                      value={complianceForm.riskLevel}
                      onChange={handleComplianceChange}
                      label="Risk Level"
                    >
                      {PRIORITY_LEVELS.map(level => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
  <FormControl fullWidth>
    <InputLabel>Business Impact</InputLabel>
    <Select
      name="businessImpact"
      value={complianceForm.businessImpact}
      onChange={handleComplianceChange}
      label="Business Impact"
    >
      {PRIORITY_LEVELS.map(level => (
        <MenuItem key={level} value={level}>{level}</MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>


                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="assignedTo"
                    label="Assigned To *"
                    value={complianceForm.assignedTo}
                    onChange={handleComplianceChange}
                    error={!!formErrors.assignedTo}
                    helperText={formErrors.assignedTo}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="responsibleDepartment"
                    label="Responsible Department *"
                    value={complianceForm.responsibleDepartment}
                    onChange={handleComplianceChange}
                    error={!!formErrors.responsibleDepartment}
                    helperText={formErrors.responsibleDepartment}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="complianceOfficer"
                    label="Compliance Officer"
                    value={complianceForm.complianceOfficer}
                    onChange={handleComplianceChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="regulatoryBody"
                    label="Regulatory Body"
                    value={complianceForm.regulatoryBody}
                    onChange={handleComplianceChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="licenseNumber"
                    label="License Number"
                    value={complianceForm.licenseNumber}
                    onChange={handleComplianceChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="cost"
                    label="Cost (₹)"
                    type="number"
                    value={complianceForm.cost}
                    onChange={handleComplianceChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="dueDate"
                    label="Due Date *"
                    type="date"
                    value={complianceForm.dueDate}
                    onChange={handleComplianceChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.dueDate}
                    helperText={formErrors.dueDate}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="completedDate"
                    label="Completed Date"
                    type="date"
                    value={complianceForm.completedDate}
                    onChange={handleComplianceChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="renewalDate"
                    label="Renewal Date"
                    type="date"
                    value={complianceForm.renewalDate}
                    onChange={handleComplianceChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="remarks"
                    label="Remarks"
                    value={complianceForm.remarks}
                    onChange={handleComplianceChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 3, px: 4 }}
                    startIcon={<AssignmentIcon />}
                  >
                    Add Compliance Record (Updates Sustainability Index)
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      )}

      {/* Enhanced Certifications Tab */}
      {tab === 1 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center',fontWeight: '900', fontSize: '1.8rem'  }}>
             <VerifiedIcon sx={{ mr: 1, backgroundColor: '#10b981', color: '#fff', padding: '2px', borderRadius: '50%' }} />
              Add Certification
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Active certifications contribute to Sustainability Index
            </Typography>
            
            <form onSubmit={handleAddCertification}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Certification Name *"
                    value={certificationForm.name}
                    onChange={handleCertificationChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="issuingAuthority"
                    label="Issuing Authority *"
                    value={certificationForm.issuingAuthority}
                    onChange={handleCertificationChange}
                    error={!!formErrors.issuingAuthority}
                    helperText={formErrors.issuingAuthority}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="certificateNumber"
                    label="Certificate Number *"
                    value={certificationForm.certificateNumber}
                    onChange={handleCertificationChange}
                    error={!!formErrors.certificateNumber || !!certificateError}
                    helperText={formErrors.certificateNumber || certificateError}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="accreditationBody"
                    label="Accreditation Body"
                    value={certificationForm.accreditationBody}
                    onChange={handleCertificationChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    name="documentPath"
    label="Document Path"
    value={certificationForm.documentPath}
    onChange={handleCertificationChange}
  />
</Grid>

<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    name="validityPeriod"
    label="Validity Period"
    value={certificationForm.validityPeriod}
    onChange={handleCertificationChange}
  />
</Grid>


                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="scope"
                    label="Certification Scope"
                    value={certificationForm.scope}
                    onChange={handleCertificationChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="issueDate"
                    label="Issue Date *"
                    type="date"
                    value={certificationForm.issueDate}
                    onChange={handleCertificationChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.issueDate}
                    helperText={formErrors.issueDate}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="expiryDate"
                    label="Expiry Date *"
                    type="date"
                    value={certificationForm.expiryDate}
                    onChange={handleCertificationChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.expiryDate}
                    helperText={formErrors.expiryDate}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="surveillanceDate"
                    label="Surveillance Date"
                    type="date"
                    value={certificationForm.surveillanceDate}
                    onChange={handleCertificationChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={certificationForm.status}
                      onChange={handleCertificationChange}
                      label="Status"
                    >
                      {CERTIFICATION_STATUS.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="cost"
                    label="Cost (₹)"
                    type="number"
                    value={certificationForm.cost}
                    onChange={handleCertificationChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="benefits"
                    label="Benefits"
                    value={certificationForm.benefits}
                    onChange={handleCertificationChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="maintenanceRequirements"
                    label="Maintenance Requirements"
                    value={certificationForm.maintenanceRequirements}
                    onChange={handleCertificationChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={certificationForm.renewalRequired}
                        onChange={(e) => setCertificationForm({...certificationForm, renewalRequired: e.target.checked})}
                      />
                    }
                    label="Renewal Required"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 3, px: 4 }}
                    startIcon={<VerifiedIcon />}
                  >
                    Add Certification (Updates Sustainability Index)
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      )}

      {/* Enhanced Audits Tab */}
      {tab === 2 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: '900', fontSize: '1.8rem' }}>
              <SecurityIcon sx={{ mr: 1, backgroundColor: '#f59e0b', color: '#fff', padding: '2px', borderRadius: '50%' }} />
              Schedule Audit
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Audit scores contribute to Sustainability Index
            </Typography>
            
            <form onSubmit={handleAddAudit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.auditType}>
                    <InputLabel>Audit Type *</InputLabel>
                    <Select
                      sx={{width: '130px'}}
                      name="auditType"
                      value={auditForm.auditType}
                      onChange={handleAuditChange}
                      label="Audit Type *"
                    >
                      {AUDIT_TYPES.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                    {formErrors.auditType && <FormHelperText>{formErrors.auditType}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="auditor"
                    label="Auditor *"
                    value={auditForm.auditor}
                    onChange={handleAuditChange}
                    error={!!formErrors.auditor}
                    helperText={formErrors.auditor}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="auditFirm"
                    label="Audit Firm"
                    value={auditForm.auditFirm}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="duration"
                    label="Duration (days)"
                    type="number"
                    value={auditForm.duration}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="auditScope"
                    label="Audit Scope *"
                    value={auditForm.auditScope}
                    onChange={handleAuditChange}
                    error={!!formErrors.auditScope}
                    helperText={formErrors.auditScope}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="auditCriteria"
                    label="Audit Criteria"
                    value={auditForm.auditCriteria}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="scheduledDate"
                    label="Scheduled Date *"
                    type="date"
                    value={auditForm.scheduledDate}
                    onChange={handleAuditChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors.scheduledDate}
                    helperText={formErrors.scheduledDate}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="completedDate"
                    label="Completed Date"
                    type="date"
                    value={auditForm.completedDate}
                    onChange={handleAuditChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="followUpDate"
                    label="Follow-up Date"
                    type="date"
                    value={auditForm.followUpDate}
                    onChange={handleAuditChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={auditForm.status}
                      onChange={handleAuditChange}
                      label="Status"
                    >
                      {AUDIT_STATUS.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="cost"
                    label="Cost (₹)"
                    type="number"
                    value={auditForm.cost}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="score"
                    label="Score (%)"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={auditForm.score}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="reportPath"
                    label="Report Path"
                    value={auditForm.reportPath}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="findings"
                    label="Findings"
                    value={auditForm.findings}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="nonConformities"
                    label="Non-Conformities"
                    value={auditForm.nonConformities}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="correctiveActions"
                    label="Corrective Actions"
                    value={auditForm.correctiveActions}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="recommendations"
                    label="Recommendations"
                    value={auditForm.recommendations}
                    onChange={handleAuditChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 3, px: 4 }}
                    startIcon={<SecurityIcon />}
                  >
                    Schedule Audit (Updates Sustainability Index)
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      )}

      {/* Enhanced Document Management Tab */}
      {tab === 3 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center',fontWeight: '900', fontSize: '1.8rem' }}>
              <UploadFileIcon sx={{ mr: 1, backgroundColor: '#8b5cf6', color: '#fff', padding: '2px', borderRadius: '50%' }} />
              Upload Document
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Document management supports compliance tracking
            </Typography>
            
            <form onSubmit={handleAddDocument}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Document Name *"
                    value={documentForm.name}
                    onChange={handleDocumentChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.type}>
                    <InputLabel>Document Type *</InputLabel>
                    <Select
                      sx={{width: '160px'}}
                      name="type"
                      value={documentForm.type}
                      onChange={handleDocumentChange}
                      label="Document Type *"
                    >
                      {DOCUMENT_TYPES.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                    {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.category}>
                    <InputLabel>Category *</InputLabel>
                    <Select
                      sx={{width: '130px'}}
                      name="category"
                      value={documentForm.category}
                      onChange={handleDocumentChange}
                      label="Category *"
                    >
                      {DOCUMENT_CATEGORIES.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                    {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                  sx={{width: '110px'}}
                    fullWidth
                    name="version"
                    label="Version"
                    value={documentForm.version}
                    onChange={handleDocumentChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    name="description"
                    label="Description"
                    value={documentForm.description}
                    onChange={handleDocumentChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="uploadedBy"
                    label="Uploaded By *"
                    value={documentForm.uploadedBy}
                    onChange={handleDocumentChange}
                    error={!!formErrors.uploadedBy}
                    helperText={formErrors.uploadedBy}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="reviewedBy"
                    label="Reviewed By"
                    value={documentForm.reviewedBy}
                    onChange={handleDocumentChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="approvedBy"
                    label="Approved By"
                    value={documentForm.approvedBy}
                    onChange={handleDocumentChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Upload Date"
    type="date"
    name="uploadDate"
    value={documentForm.uploadDate}
    onChange={handleDocumentChange}
    InputLabelProps={{ shrink: true }}
  />
</Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="expiryDate"
                    label="Expiry Date"
                    type="date"
                    value={documentForm.expiryDate}
                    onChange={handleDocumentChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="size"
                    label="File Size"
                    value={documentForm.size}
                    onChange={handleDocumentChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="filePath"
                    label="File Path"
                    value={documentForm.filePath}
                    onChange={handleDocumentChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={documentForm.status}
                      onChange={handleDocumentChange}
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Expired">Expired</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 3, px: 4 }}
                    startIcon={<UploadFileIcon />}
                  >
                    Upload Document
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ComplianceCertification;
