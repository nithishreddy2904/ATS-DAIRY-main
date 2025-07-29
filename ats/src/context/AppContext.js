import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { farmersAPI, suppliersAPI, milkEntriesAPI, fleetManagementAPI, deliveriesAPI, processingUnitsAPI, productionBatchesAPI, qualityControlAPI, maintenanceAPI, retailersAPI, salesAPI, inventoryAPI, employeeAPI, paymentsAPI, billsAPI, labQualityTestsAPI, reviewsAPI, farmerFeedbackAPI, messagesAPI, announcementsAPI, groupMessagesAPI,
complianceRecordsAPI, certificationsAPI, auditsAPI, documentsAPI} from '../services/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Database-connected data with loading states
  const [farmers, setFarmers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [milkEntries, setMilkEntries] = useState([]);
  const [fleetManagement, setFleetManagement] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [processingUnits, setProcessingUnits] = useState([]);
  const [productionBatches, setProductionBatches] = useState([]);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [qualityControlRecords, setQualityControlRecords] = useState([]);
  const [qualityControlLoading, setQualityControlLoading] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [retailersFromDB, setRetailersFromDB] = useState([]);
  const [salesFromDB, setSalesFromDB] = useState([]);   
  const [retailersLoading, setRetailersLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);
   // Backend-connected inventory data
  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  // Backend-connected employee data
  const [employeesFromDB, setEmployeesFromDB] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  // Backend-connected payment data
  const [paymentsFromDB, setPaymentsFromDB] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [billsFromDB, setBillsFromDB] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [labQualityTests, setLabQualityTests] = useState([]);
  const [labQualityTestsLoading, setLabQualityTestsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  // Farmer Feedback state (backend-connected)
  const [farmerFeedback, setFarmerFeedback] = useState([]);
  const [farmerFeedbackLoading, setFarmerFeedbackLoading] = useState(false);
  const [farmerFeedbackError, setFarmerFeedbackError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupMessagesLoading, setGroupMessagesLoading] = useState(false);
  const [groupMessagesError, setGroupMessagesError] = useState(null);
  const [complianceRecordsFromDB, setComplianceRecordsFromDB] = useState([]);
  const [certificationsFromDB, setCertificationsFromDB] = useState([]);
  const [complianceRecordsLoading, setComplianceRecordsLoading] = useState(false);
  const [certificationsLoading, setCertificationsLoading] = useState(false);
  const [auditsFromDB, setAuditsFromDB] = useState([]);
  const [auditsLoading, setAuditsLoading] = useState(false);
  const [documentsFromDB, setDocumentsFromDB] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ORIGINAL: Shared Inventory Data (unchanged)
  const [inventoryItems, setInventoryItems] = useState([
    { code: 'RMK0001', name: 'Fresh Toned Milk', category: 'Raw Milk', quantity: '1200', unit: 'Liters', minStock: '500', maxStock: '2000', supplier: 'Dairy Farm Co.', location: 'Cold Storage', status: 'In Stock', lastUpdated: '2025-06-09' },
    { code: 'PKG0001', name: 'PET Bottles 500ml', category: 'Packaging Materials', quantity: '50', unit: 'Boxes', minStock: '100', maxStock: '500', supplier: 'Packaging Solutions Ltd.', location: 'Warehouse A', status: 'Low Stock', lastUpdated: '2025-06-08' }
  ]);

  // ORIGINAL: Quality Tests Data (unchanged)
  const [qualityTests, setQualityTests] = useState([
    { 
      id: 'QT001', 
      batchId: 'BATCH0001', 
      sampleId: 'SAMPLE000001', 
      farmerId: 'FARM0001', 
      farmerName: 'Rajesh Kumar', 
      testDate: '2025-06-15', 
      testType: 'Routine Test', 
      fatContent: '4.2', 
      proteinContent: '3.4', 
      lactoseContent: '4.8', 
      snfContent: '8.5', 
      phLevel: '6.7', 
      bacteriaCount: '15000', 
      adulteration: 'None Detected', 
      overallGrade: 'A+', 
      status: 'Completed', 
      remarks: 'Excellent quality milk', 
      testedBy: 'Dr. Priya Sharma' 
    },
    { 
      id: 'QT002', 
      batchId: 'BATCH0002', 
      sampleId: 'SAMPLE000002', 
      farmerId: 'FARM0002', 
      farmerName: 'Priya Sharma', 
      testDate: '2025-06-16', 
      testType: 'Routine Test', 
      fatContent: '3.8', 
      proteinContent: '3.2', 
      lactoseContent: '4.6', 
      snfContent: '8.2', 
      phLevel: '6.8', 
      bacteriaCount: '18000', 
      adulteration: 'None Detected', 
      overallGrade: 'A', 
      status: 'Completed', 
      remarks: 'Good quality milk', 
      testedBy: 'Dr. Anita Singh' 
    },
    { 
      id: 'QT003', 
      batchId: 'BATCH0003', 
      sampleId: 'SAMPLE000003', 
      farmerId: 'FARM0001', 
      farmerName: 'Rajesh Kumar', 
      testDate: '2025-06-17', 
      testType: 'Special Test', 
      fatContent: '3.5', 
      proteinContent: '3.0', 
      lactoseContent: '4.4', 
      snfContent: '8.0', 
      phLevel: '6.9', 
      bacteriaCount: '22000', 
      adulteration: 'None Detected', 
      overallGrade: 'B', 
      status: 'Completed', 
      remarks: 'Average quality', 
      testedBy: 'Dr. Priya Sharma' 
    }
  ]);

  

  const [qualityChecksData, setQualityChecksData] = useState([
    { batchId: 'B001', unitId: 'PU0001', testDate: '2025-06-05', parameters: { fat: '3.5', protein: '3.2', moisture: '87.5', ph: '6.7' }, result: 'Pass', inspector: 'Dr. Anita' }
  ]);

  const [maintenanceRecordsData, setMaintenanceRecordsData] = useState([
    { unitId: 'PU0001', date: '2025-06-03', type: 'Preventive', description: 'Regular cleaning and calibration', cost: '5000', technician: 'Suresh Tech', status: 'Completed' }
  ]);

  // ORIGINAL: Shared Logistics Data (unchanged)
  const [vehicles, setVehicles] = useState([
    { number: 'AP09CD1234', type: 'Truck', driver: 'Rajesh Kumar', capacity: '2000', status: 'Available', fuelType: 'Diesel' }
  ]);

  

  // ORIGINAL: Shared Sales Data (unchanged)
  const [retailers, setRetailers] = useState([
    { name: 'FreshMart', location: 'Hyderabad', contact: '9876543210' },
    { name: 'DairyLand', location: 'Secunderabad', contact: '9123456789' }
  ]);

  const [sales, setSales] = useState([
    { date: '2025-06-26', retailer: 'FreshMart', amount: '15000' },
    { date: '2025-06-25', retailer: 'DairyLand', amount: '12000' },
    { date: '2025-06-24', retailer: 'FreshMart', amount: '8500' },
    { date: '2025-05-28', retailer: 'FreshMart', amount: '5000' },
    { date: '2025-05-27', retailer: 'DairyLand', amount: '3200' }
  ]);

  // ORIGINAL: Shared Workforce Data (unchanged)
  // REPLACE the existing employees state with this enhanced structure:
const [employees, setEmployees] = useState([
  { 
    id: 'EMP0001', 
    name: 'Rajesh Kumar', 
    position: 'Production Manager', 
    department: 'Production', 
    phone: '9876543210', 
    email: 'rajesh@dairy.com', 
    salary: '55000', 
    joinDate: '2024-01-15', 
    status: 'Active',
    address: 'H.No 123, Sector 15, Gurgaon, Haryana',
    emergencyContact: '9876543211',
    experience: '8',
    qualification: 'B.Tech Mechanical Engineering',
    bloodGroup: 'O+',
    dateOfBirth: '1990-03-15'
  },
  { 
    id: 'EMP0002', 
    name: 'Priya Sharma', 
    position: 'Quality Analyst', 
    department: 'Quality Control', 
    phone: '9876543211', 
    email: 'priya@dairy.com', 
    salary: '38000', 
    joinDate: '2024-02-01', 
    status: 'Active',
    address: 'Flat 45, Green Valley, Pune, Maharashtra',
    emergencyContact: '9876543212',
    experience: '5',
    qualification: 'M.Sc Food Technology',
    bloodGroup: 'A+',
    dateOfBirth: '1992-07-22'
  },
  { 
    id: 'EMP0003', 
    name: 'Amit Singh', 
    position: 'Process Technician', 
    department: 'Processing', 
    phone: '9876543212', 
    email: 'amit@dairy.com', 
    salary: '32000', 
    joinDate: '2024-03-15', 
    status: 'Active',
    address: 'Village Rampur, District Meerut, UP',
    emergencyContact: '9876543213',
    experience: '3',
    qualification: 'Diploma in Dairy Technology',
    bloodGroup: 'B+',
    dateOfBirth: '1995-11-08'
  },
  { 
    id: 'EMP0004', 
    name: 'Sunita Patel', 
    position: 'Logistics Coordinator', 
    department: 'Logistics', 
    phone: '9876543213', 
    email: 'sunita@dairy.com', 
    salary: '35000', 
    joinDate: '2024-04-10', 
    status: 'Active',
    address: 'A-302, Sunrise Apartments, Ahmedabad, Gujarat',
    emergencyContact: '9876543214',
    experience: '4',
    qualification: 'MBA Supply Chain Management',
    bloodGroup: 'AB+',
    dateOfBirth: '1988-05-18'
  }
]);


  // ORIGINAL: Shared Reviews Data (unchanged)
  // const [reviews, setReviews] = useState([
  //   { id: 'REV001', customerName: 'Rajesh Kumar', customerEmail: 'rajesh@email.com', category: 'Product Quality', rating: 5, subject: 'Excellent milk quality', comment: 'The milk quality is consistently excellent. Very satisfied with the freshness and taste.', date: '2025-06-08', status: 'Responded' }
  // ]);

  // ORIGINAL: Employee Satisfaction Data (unchanged)
  const [employeeData, setEmployeeData] = useState({
    surveys: [
      { employeeId: 'EMP0001', jobSatisfaction: 9, workLifeBalance: 8, compensationSatisfaction: 9, workEnvironmentRating: 9, surveyDate: '2025-06-01' },
      { employeeId: 'EMP0002', jobSatisfaction: 8, workLifeBalance: 9, compensationSatisfaction: 8, workEnvironmentRating: 8, surveyDate: '2025-06-01' },
      { employeeId: 'EMP0003', jobSatisfaction: 9, workLifeBalance: 7, compensationSatisfaction: 8, workEnvironmentRating: 9, surveyDate: '2025-06-01' }
    ],
    performanceData: [
      { employeeId: 'EMP0001', careerGrowthRating: 8, performanceScore: 95, trainingCompleted: 12, attendanceRate: 98 },
      { employeeId: 'EMP0002', careerGrowthRating: 9, performanceScore: 92, trainingCompleted: 10, attendanceRate: 96 },
      { employeeId: 'EMP0003', careerGrowthRating: 7, performanceScore: 88, trainingCompleted: 8, attendanceRate: 94 }
    ]
  });

  // ORIGINAL: COMPLIANCE DATA FOR SUSTAINABILITY CALCULATION (unchanged)
  const [complianceRecords, setComplianceRecords] = useState([
    { id: 'COMP001', type: 'FSSAI License', title: 'FSSAI License Renewal', description: 'Annual renewal of FSSAI manufacturing license', status: 'Compliant', priority: 'High', dueDate: '2025-12-31', completedDate: '2025-01-15', assignedTo: 'Quality Manager', documents: ['FSSAI_License.pdf'] },
    { id: 'COMP002', type: 'Environmental Clearance', title: 'ETP Compliance Report', description: 'Monthly effluent treatment plant compliance report', status: 'Compliant', priority: 'Medium', dueDate: '2025-06-30', completedDate: '2025-06-15', assignedTo: 'Environmental Officer', documents: [] },
    { id: 'COMP003', type: 'ISO Certification', title: 'ISO 14001 Environmental Management', description: 'Environmental management system certification', status: 'Compliant', priority: 'High', dueDate: '2025-12-31', completedDate: '2025-03-01', assignedTo: 'Quality Manager', documents: [] },
    { id: 'COMP004', type: 'HACCP', title: 'HACCP Food Safety Standards', description: 'Food safety management system compliance', status: 'Compliant', priority: 'Critical', dueDate: '2025-08-31', completedDate: '2025-04-10', assignedTo: 'Food Safety Officer', documents: [] }
  ]);

  const [certifications, setCertifications] = useState([
    { id: 'CERT001', name: 'ISO 22000:2018', issuingAuthority: 'Bureau Veritas', certificateNumber: 'ISO123456', issueDate: '2024-01-15', expiryDate: '2027-01-14', status: 'Active', renewalRequired: false, documentPath: 'ISO22000.pdf' },
    { id: 'CERT002', name: 'HACCP Certification', issuingAuthority: 'SGS India', certificateNumber: 'HAC789012', issueDate: '2024-03-10', expiryDate: '2025-03-09', status: 'Active', renewalRequired: false, documentPath: 'HACCP.pdf' },
    { id: 'CERT003', name: 'ISO 14001:2015', issuingAuthority: 'TUV India', certificateNumber: 'ENV456789', issueDate: '2024-02-20', expiryDate: '2027-02-19', status: 'Active', renewalRequired: false, documentPath: 'ISO14001.pdf' }
  ]);

  const [audits, setAudits] = useState([
    { id: 'AUD001', auditType: 'Internal Audit', auditor: 'Internal QA Team', scheduledDate: '2025-06-15', completedDate: '2025-06-15', status: 'Completed', findings: 'Minor non-conformities in documentation', correctiveActions: 'Updated SOPs and training conducted', score: 85 },
    { id: 'AUD002', auditType: 'External Audit', auditor: 'Bureau Veritas', scheduledDate: '2025-07-20', completedDate: '2025-07-20', status: 'Completed', findings: 'Excellent compliance standards', correctiveActions: 'None required', score: 95 },
    { id: 'AUD003', auditType: 'Environmental Audit', auditor: 'TUV India', scheduledDate: '2025-05-10', completedDate: '2025-05-10', status: 'Completed', findings: 'Good environmental practices', correctiveActions: 'Minor improvements in waste management', score: 88 }
  ]);

  // ORIGINAL: Processing Efficiency Data - KEPT ORIGINAL STRUCTURE (unchanged)
  const [processingData, setProcessingData] = useState({
    equipmentUptime: { 
      scheduledHours: 720, 
      maintenanceHours: 8, 
      breakdownHours: 4,
      productiveHours: 708 
    },
    throughputEfficiency: { 
      actualOutput: 9800, 
      plannedOutput: 10000,
      unit: 'liters' 
    },
    qualityRate: { 
      passedQualityTests: 485, 
      totalProductionBatches: 500,
      rejectedBatches: 15 
    },
    wasteMinimization: { 
      wasteGenerated: 50, 
      totalInput: 10000, 
      unit: 'kg' 
    },
    energyEfficiency: { 
      energyConsumed: 2400, 
      unitsProduced: 10000, 
      targetEnergyPerUnit: 0.25,
      unit: 'kWh' 
    }
  });

  // Load data from database on component mount
  useEffect(() => {
    loadFarmersFromDatabase();
    loadSuppliersFromDatabase();
    loadMilkEntriesFromDatabase();
    loadFleetManagementFromDatabase();
    loadDeliveriesFromDatabase();
    loadProcessingUnitsFromDatabase();
    loadProductionBatchesFromDatabase();
    loadQualityControlRecordsFromDatabase();
    loadMaintenanceRecordsFromDatabase();
    loadRetailersFromDatabase(); // <-- Add this line
    loadSalesFromDatabase();
    loadInventoryRecordsFromDatabase();
    loadEmployeesFromDatabase();
    loadPaymentsFromDatabase();
    loadBillsFromDatabase();
    loadLabQualityTestsFromDatabase();
    loadReviewsFromDatabase();
    loadFarmerFeedbackFromDatabase();
    loadMessagesFromDatabase();
    loadAnnouncementsFromDatabase();
    loadGroupMessagesFromDatabase();
    loadComplianceRecordsFromDatabase();
    loadCertificationsFromDatabase();
    loadAuditsFromDatabase();
    loadDocumentsFromDatabase();
  }, []);

   // In AppContext.js - Update the generateQualityDistribution calculation
const generateQualityDistribution = useMemo(() => {
  console.log('🔍 Generating quality distribution from labQualityTests:', labQualityTests.length);
  
  const qualityCount = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0 };
  
  labQualityTests.forEach(test => {
    console.log('Processing test:', test.id, 'Grade:', test.overall_grade);
    if (test.overall_grade) {
      qualityCount[test.overall_grade] = (qualityCount[test.overall_grade] || 0) + 1;
    }
  });

  const total = Object.values(qualityCount).reduce((sum, count) => sum + count, 0);
  console.log('📊 Quality count breakdown:', qualityCount, 'Total:', total);
  
  if (total === 0) {
    return [
      { name: 'No Data', value: 100, color: '#9e9e9e' }
    ];
  }

  return [
    { name: 'Excellent (A+)', value: Math.round((qualityCount['A+'] / total) * 100), color: '#4caf50' },
    { name: 'Good (A)', value: Math.round((qualityCount['A'] / total) * 100), color: '#2196f3' },
    { name: 'Average (B)', value: Math.round((qualityCount['B'] / total) * 100), color: '#ff9800' },
    { name: 'Poor (C)', value: Math.round((qualityCount['C'] / total) * 100), color: '#f44336' },
  ].filter(item => item.value > 0);
}, [labQualityTests]); // ✅ Ensure dependency is labQualityTests



  const loadFarmersFromDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await farmersAPI.getAll();
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const formattedFarmers = response.data.map(farmer => {
          let joinDate = '';
          if (farmer.join_date) {
            const date = new Date(farmer.join_date);
            joinDate = date.toISOString().split('T')[0];
          }
          return {
            id: farmer.id || '',
            name: farmer.name || '',
            phone: String(farmer.phone || ''),
            email: farmer.email || '',
            address: farmer.address || '',
            cattleCount: String(farmer.cattle_count || 0),
            bankAccount: String(farmer.bank_account || ''),
            ifscCode: farmer.ifsc_code || '',
            status: farmer.status || 'Active',
            joinDate: joinDate
          };
        });
        setFarmers(formattedFarmers);
      } else {
        throw new Error('Invalid response format or empty data');
      }
    } catch (err) {
      setError(err.message || 'Failed to load farmers');
      setFarmers([
        { id: 'FARM0001', name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@email.com', address: 'Village Rampur, District Meerut', cattleCount: '15', bankAccount: '123456789012', ifscCode: 'SBIN0001234', status: 'Active', joinDate: '2025-01-15' },
        { id: 'FARM0002', name: 'Priya Sharma', phone: '8765432109', email: 'priya@email.com', address: 'Village Sundarpur, District Haridwar', cattleCount: '8', bankAccount: '234567890123', ifscCode: 'HDFC0002345', status: 'Active', joinDate: '2025-02-10' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliersFromDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await suppliersAPI.getAll();
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const formattedSuppliers = response.data.map(supplier => {
          let joinDate = '';
          if (supplier.join_date) {
            const date = new Date(supplier.join_date);
            joinDate = date.toISOString().split('T')[0];
          }
          return {
            id: supplier.id || '',
            companyName: supplier.company_name || '',
            contactPerson: supplier.contact_person || '',
            phone: String(supplier.phone || ''),
            email: supplier.email || '',
            address: supplier.address || '',
            supplierType: supplier.supplier_type || '',
            status: supplier.status || 'Active',
            joinDate: joinDate
          };
        });
        setSuppliers(formattedSuppliers);
      } else {
        throw new Error('Invalid response format or empty data');
      }
    } catch (err) {
      setError(err.message || 'Failed to load suppliers');
      setSuppliers([
        { id: 'SUP001', companyName: 'Green Feed Industries', contactPerson: 'Amit Singh', phone: '9123456789', email: 'amit@greenfeed.com', address: 'Industrial Area, Gurgaon', supplierType: 'Feed Supplier', status: 'Active', joinDate: '2024-12-01' },
        { id: 'SUP002', companyName: 'Dairy Equipment Co.', contactPerson: 'Sunita Patel', phone: '8234567890', email: 'sunita@dairyequip.com', address: 'Tech Park, Pune', supplierType: 'Equipment Supplier', status: 'Active', joinDate: '2025-01-20' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadMilkEntriesFromDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await milkEntriesAPI.getAll();
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const formattedMilkEntries = response.data.map(entry => {
          let entryDate = '';
          if (entry.date) {
            const date = new Date(entry.date);
            entryDate = date.toISOString().split('T')[0];
          }
          return {
            id: entry.id,
            farmerId: entry.farmer_id || '',
            farmerName: entry.farmer_name || '',
            date: entryDate,
            quantity: String(entry.quantity || 0),
            shift: entry.shift || 'Morning',
            quality: entry.quality || 'A',
            fatContent: entry.fat_content ? String(entry.fat_content) : '',
            snfContent: entry.snf_content ? String(entry.snf_content) : '',
            temperature: entry.temperature ? String(entry.temperature) : '',
            phLevel: entry.ph_level ? String(entry.ph_level) : '',
            collectionCenter: entry.collection_center || '',
            collectedBy: entry.collected_by || '',
            vehicleNumber: entry.vehicle_number || '',
            remarks: entry.remarks || '',
            paymentAmount: entry.payment_amount ? String(entry.payment_amount) : '',
            paymentStatus: entry.payment_status || 'Pending'
          };
        });
        setMilkEntries(formattedMilkEntries);
      } else {
        throw new Error('Invalid response format or empty data');
      }
    } catch (err) {
      setError(err.message || 'Failed to load milk entries');
      setMilkEntries([
        { id: 1, farmerId: 'FARM0001', farmerName: 'Rajesh Kumar', date: '2025-06-25', quantity: '10', shift: 'Morning', quality: 'A+', fatContent: '4.2', snfContent: '8.5', temperature: '4.0', phLevel: '6.7', collectionCenter: 'Center A', collectedBy: 'Collector 1', vehicleNumber: 'MH12AB1234', remarks: 'Good quality', paymentAmount: '500', paymentStatus: 'Paid' },
        { id: 2, farmerId: 'FARM0002', farmerName: 'Priya Sharma', date: '2025-06-25', quantity: '15', shift: 'Evening', quality: 'A', fatContent: '3.8', snfContent: '8.2', temperature: '4.5', phLevel: '6.8', collectionCenter: 'Center B', collectedBy: 'Collector 2', vehicleNumber: 'MH12CD5678', remarks: 'Standard quality', paymentAmount: '750', paymentStatus: 'Pending' }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const loadFleetManagementFromDatabase = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fleetManagementAPI.getAll();
    if (response && response.success && Array.isArray(response.data)) {
      setFleetManagement(response.data.map(f => ({
        id: f.id || '',
        vehicleNumber: f.vehicle_number || '',
        vehicleType: f.vehicle_type || '',
        driverName: f.driver_name || '',
        driverPhone: f.driver_phone || '',
        capacity: String(f.capacity || ''),
        status: f.status || 'Available',
        lastMaintenanceDate: f.last_maintenance_date || '',
        nextMaintenanceDate: f.next_maintenance_date || '',
        location: f.location || '',
        fuelType: f.fuel_type || 'Diesel' // <-- add this line
      })));
    } else {
      throw new Error('Invalid fleet data');
    }
  } catch (err) {
    setError(err.message || 'Failed to load fleet');
    setFleetManagement([]);
  } finally {
    setLoading(false);
  }
};

const addFleetRecord = async (fleet) => {
  const dbFleet = {
    id: fleet.id,
    vehicle_number: fleet.vehicleNumber,
    vehicle_type: fleet.vehicleType,
    driver_name: fleet.driverName,
    driver_phone: fleet.driverPhone,
    capacity: parseInt(fleet.capacity) || 0,
    status: fleet.status,
    last_maintenance_date: fleet.lastMaintenanceDate || null,
    next_maintenance_date: fleet.nextMaintenanceDate || null,
    location: fleet.location,
    fuel_type: fleet.fuelType,
  };
  const response = await fleetManagementAPI.create(dbFleet);
  if (response && response.success) {
    setFleetManagement(prev => [fleet, ...prev]);
  }
};

const updateFleetRecord = async (idx, fleet) => {
  const id = fleetManagement[idx].id;
  const dbFleet = {
    vehicle_number: fleet.vehicleNumber,
    vehicle_type: fleet.vehicleType,
    driver_name: fleet.driverName,
    driver_phone: fleet.driverPhone,
    capacity: parseInt(fleet.capacity) || 0,
    status: fleet.status,
    last_maintenance_date: fleet.lastMaintenanceDate || null,
    next_maintenance_date: fleet.nextMaintenanceDate || null,
    location: fleet.location,
    fuel_type: fleet.fuelType,
  };
  const response = await fleetManagementAPI.update(id, dbFleet);
  if (response && response.success) {
    setFleetManagement(prev => prev.map((f, i) => i === idx ? fleet : f));
  }
};

const deleteFleetRecord = async (idx) => {
  const id = fleetManagement[idx].id;
  await fleetManagementAPI.delete(id);
  setFleetManagement(prev => prev.filter((_, i) => i !== idx));
};
   const loadDeliveriesFromDatabase = async () => {
  setDeliveriesLoading(true);
  try {
    setError(null);
    const response = await deliveriesAPI.getAll();
    if (response && response.success && Array.isArray(response.data)) {
      setDeliveries(
        response.data.map(d => ({
          ...d,
          priority: d.priority || 'Medium',
          estimatedTime: d.estimatedTime || '',
          distance: d.distance || ''
        }))
      );
    } else {
      throw new Error('Invalid deliveries data');
    }
  } catch (err) {
    setError(err.message || 'Failed to load deliveries');
    setDeliveries([]);
  } finally {
    setDeliveriesLoading(false);
  }
};

const addDelivery = async (delivery) => {
  const dbDelivery = {
    delivery_date: delivery.delivery_date,
    vehicle_id: delivery.vehicle_id,
    driver_name: delivery.driver_name,
    destination: delivery.destination,
    status: delivery.status,
    priority: delivery.priority,           // <-- new field
    estimatedTime: delivery.estimatedTime, // <-- new field
    distance: delivery.distance            // <-- new field
  };
  const response = await deliveriesAPI.create(dbDelivery);
  if (response && response.success) {
    await loadDeliveriesFromDatabase(); // reload to get latest data
  }
};

const updateDelivery = async (id, delivery) => {
  const dbDelivery = {
    delivery_date: delivery.delivery_date,
    vehicle_id: delivery.vehicle_id,
    driver_name: delivery.driver_name,
    destination: delivery.destination,
    status: delivery.status,
    priority: delivery.priority,           // <-- new field
    estimatedTime: delivery.estimatedTime, // <-- new field
    distance: delivery.distance            // <-- new field
  };
  const response = await deliveriesAPI.update(id, dbDelivery);
  if (response && response.success) {
    await loadDeliveriesFromDatabase();
  }
};

const deleteDelivery = async (id) => {
  await deliveriesAPI.delete(id);
  setDeliveries(prev => prev.filter(d => d.id !== id));
};


  // Database operations for farmers
  const addFarmer = async (farmerData) => {
    try {
      const dbFarmerData = {
        id: farmerData.id,
        name: farmerData.name,
        phone: farmerData.phone,
        email: farmerData.email,
        address: farmerData.address,
        cattle_count: parseInt(farmerData.cattleCount) || 0,
        bank_account: farmerData.bankAccount,
        ifsc_code: farmerData.ifscCode,
        status: farmerData.status,
        join_date: farmerData.joinDate
      };

      const response = await farmersAPI.create(dbFarmerData);
      if (response && response.success) {
        const newFarmer = {
          id: response.data.id,
          name: response.data.name,
          phone: String(response.data.phone),
          email: response.data.email,
          address: response.data.address,
          cattleCount: String(response.data.cattle_count || 0),
          bankAccount: String(response.data.bank_account),
          ifscCode: response.data.ifsc_code,
          status: response.data.status,
          joinDate: response.data.join_date ? new Date(response.data.join_date).toISOString().split('T')[0] : ''
        };
        setFarmers(prev => [newFarmer, ...prev]);
        return response;
      }
    } catch (error) {
      setFarmers(prev => [farmerData, ...prev]);
      throw error;
    }
  };

  const updateFarmer = async (index, farmerData) => {
    try {
      const farmerId = farmers[index].id;
      const dbFarmerData = {
        name: farmerData.name,
        phone: farmerData.phone,
        email: farmerData.email,
        address: farmerData.address,
        cattle_count: parseInt(farmerData.cattleCount) || 0,
        bank_account: farmerData.bankAccount,
        ifsc_code: farmerData.ifscCode,
        status: farmerData.status,
        join_date: farmerData.joinDate
      };

      const response = await farmersAPI.update(farmerId, dbFarmerData);
      if (response && response.success) {
        const updatedFarmer = {
          id: response.data.id,
          name: response.data.name,
          phone: String(response.data.phone),
          email: response.data.email,
          address: response.data.address,
          cattleCount: String(response.data.cattle_count || 0),
          bankAccount: String(response.data.bank_account),
          ifscCode: response.data.ifsc_code,
          status: response.data.status,
          joinDate: response.data.join_date ? new Date(response.data.join_date).toISOString().split('T')[0] : ''
        };
        setFarmers(prev => {
          const updated = [...prev];
          updated[index] = updatedFarmer;
          return updated;
        });
        return response;
      }
    } catch (error) {
      setFarmers(prev => {
        const updated = [...prev];
        updated[index] = farmerData;
        return updated;
      });
      throw error;
    }
  };

   const deleteFarmer = async (index) => {
  if (!farmers || !Array.isArray(farmers) || !farmers[index] || !farmers[index].id) {
    alert('Farmer not found or already deleted.');
    return;
  }
  const id = farmers[index].id;
  try {
    const res = await farmersAPI.delete(id);
    console.log('Delete response:', res);
    if (res?.success) {
      setFarmers(prev => prev.filter((_, i) => i !== index));
    } else {
      throw new Error(res.data?.message || 'Delete failed');
    }
  } catch (error) {
    alert('Error deleting farmer: ' + (error.response?.data?.message || error.message));
    console.error('Error deleting farmer:', error);
  }
};


  // Database operations for suppliers
  const addSupplier = async (supplierData) => {
    try {
      const dbSupplierData = {
        id: supplierData.id,
        company_name: supplierData.companyName,
        contact_person: supplierData.contactPerson,
        phone: supplierData.phone,
        email: supplierData.email,
        address: supplierData.address,
        supplier_type: supplierData.supplierType,
        status: supplierData.status,
        join_date: supplierData.joinDate
      };

      const response = await suppliersAPI.create(dbSupplierData);
      if (response && response.success) {
        const newSupplier = {
          id: response.data.id,
          companyName: response.data.company_name,
          contactPerson: response.data.contact_person,
          phone: String(response.data.phone),
          email: response.data.email,
          address: response.data.address,
          supplierType: response.data.supplier_type,
          status: response.data.status,
          joinDate: response.data.join_date ? new Date(response.data.join_date).toISOString().split('T')[0] : ''
        };
        setSuppliers(prev => [newSupplier, ...prev]);
        return response;
      }
    } catch (error) {
      setSuppliers(prev => [supplierData, ...prev]);
      throw error;
    }
  };

  const updateSupplier = async (index, supplierData) => {
    try {
      const supplierId = suppliers[index].id;
      const dbSupplierData = {
        company_name: supplierData.companyName,
        contact_person: supplierData.contactPerson,
        phone: supplierData.phone,
        email: supplierData.email,
        address: supplierData.address,
        supplier_type: supplierData.supplierType,
        status: supplierData.status,
        join_date: supplierData.joinDate
      };

      const response = await suppliersAPI.update(supplierId, dbSupplierData);
      if (response && response.success) {
        const updatedSupplier = {
          id: response.data.id,
          companyName: response.data.company_name,
          contactPerson: response.data.contact_person,
          phone: String(response.data.phone),
          email: response.data.email,
          address: response.data.address,
          supplierType: response.data.supplier_type,
          status: response.data.status,
          joinDate: response.data.join_date ? new Date(response.data.join_date).toISOString().split('T')[0] : ''
        };
        setSuppliers(prev => {
          const updated = [...prev];
          updated[index] = updatedSupplier;
          return updated;
        });
        return response;
      }
    } catch (error) {
      setSuppliers(prev => {
        const updated = [...prev];
        updated[index] = supplierData;
        return updated;
      });
      throw error;
    }
  };

  const deleteSupplier = async (index) => {
    try {
      const supplierId = suppliers[index].id;
      await suppliersAPI.delete(supplierId);
      setSuppliers(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      setSuppliers(prev => prev.filter((_, i) => i !== index));
      throw error;
    }
  };

  // Database operations for milk entries
  const addMilkEntry = async (entryData) => {
    try {
      const dbEntryData = {
        farmer_id: entryData.farmerId,
        farmer_name: entryData.farmerName,
        date: entryData.date,
        quantity: parseFloat(entryData.quantity) || 0,
        shift: entryData.shift,
        quality: entryData.quality,
        fat_content: entryData.fatContent ? parseFloat(entryData.fatContent) : null,
        snf_content: entryData.snfContent ? parseFloat(entryData.snfContent) : null,
        temperature: entryData.temperature ? parseFloat(entryData.temperature) : null,
        ph_level: entryData.phLevel ? parseFloat(entryData.phLevel) : null,
        collection_center: entryData.collectionCenter,
        collected_by: entryData.collectedBy,
        vehicle_number: entryData.vehicleNumber,
        remarks: entryData.remarks,
        payment_amount: entryData.paymentAmount ? parseFloat(entryData.paymentAmount) : null,
        payment_status: entryData.paymentStatus || 'Pending'
      };

      const response = await milkEntriesAPI.create(dbEntryData);
      if (response && response.success) {
        const newEntry = {
          id: response.data.id,
          farmerId: response.data.farmer_id,
          farmerName: response.data.farmer_name,
          date: response.data.date ? new Date(response.data.date).toISOString().split('T')[0] : '',
          quantity: String(response.data.quantity || 0),
          shift: response.data.shift,
          quality: response.data.quality,
          fatContent: response.data.fat_content ? String(response.data.fat_content) : '',
          snfContent: response.data.snf_content ? String(response.data.snf_content) : '',
          temperature: response.data.temperature ? String(response.data.temperature) : '',
          phLevel: response.data.ph_level ? String(response.data.ph_level) : '',
          collectionCenter: response.data.collection_center || '',
          collectedBy: response.data.collected_by || '',
          vehicleNumber: response.data.vehicle_number || '',
          remarks: response.data.remarks || '',
          paymentAmount: response.data.payment_amount ? String(response.data.payment_amount) : '',
          paymentStatus: response.data.payment_status || 'Pending'
        };
        setMilkEntries(prev => [newEntry, ...prev]);
        updateInventoryOnMilkCollection(newEntry.quantity);
        return response;
      }
    } catch (error) {
      setMilkEntries(prev => [entryData, ...prev]);
      updateInventoryOnMilkCollection(entryData.quantity);
      throw error;
    }
  };

  const updateMilkEntry = async (index, entryData) => {
    try {
      const entryId = milkEntries[index].id;
      const dbEntryData = {
        farmer_id: entryData.farmerId,
        farmer_name: entryData.farmerName,
        date: entryData.date,
        quantity: parseFloat(entryData.quantity) || 0,
        shift: entryData.shift,
        quality: entryData.quality,
        fat_content: entryData.fatContent ? parseFloat(entryData.fatContent) : null,
        snf_content: entryData.snfContent ? parseFloat(entryData.snfContent) : null,
        temperature: entryData.temperature ? parseFloat(entryData.temperature) : null,
        ph_level: entryData.phLevel ? parseFloat(entryData.phLevel) : null,
        collection_center: entryData.collectionCenter,
        collected_by: entryData.collectedBy,
        vehicle_number: entryData.vehicleNumber,
        remarks: entryData.remarks,
        payment_amount: entryData.paymentAmount ? parseFloat(entryData.paymentAmount) : null,
        payment_status: entryData.paymentStatus || 'Pending'
      };

      const response = await milkEntriesAPI.update(entryId, dbEntryData);
      if (response && response.success) {
        const updatedEntry = {
          id: response.data.id,
          farmerId: response.data.farmer_id,
          farmerName: response.data.farmer_name,
          date: response.data.date ? new Date(response.data.date).toISOString().split('T')[0] : '',
          quantity: String(response.data.quantity || 0),
          shift: response.data.shift,
          quality: response.data.quality,
          fatContent: response.data.fat_content ? String(response.data.fat_content) : '',
          snfContent: response.data.snf_content ? String(response.data.ssnf_content) : '',
          temperature: response.data.temperature ? String(response.data.temperature) : '',
          phLevel: response.data.ph_level ? String(response.data.ph_level) : '',
          collectionCenter: response.data.collection_center || '',
          collectedBy: response.data.collected_by || '',
          vehicleNumber: response.data.vehicle_number || '',
          remarks: response.data.remarks || '',
          paymentAmount: response.data.payment_amount ? String(response.data.payment_amount) : '',
          paymentStatus: response.data.payment_status || 'Pending'
        };
        setMilkEntries(prev => {
          const updated = [...prev];
          updated[index] = updatedEntry;
          return updated;
        });
        return response;
      }
    } catch (error) {
      setMilkEntries(prev => {
        const updated = [...prev];
        updated[index] = entryData;
        return updated;
      });
      throw error;
    }
  };

  const deleteMilkEntry = async (index) => {
    try {
      const entryId = milkEntries[index].id;
      await milkEntriesAPI.delete(entryId);
      setMilkEntries(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      setMilkEntries(prev => prev.filter((_, i) => i !== index));
      throw error;
    }
  };
     // Quality Control Records CRUD Operations
  const loadQualityControlRecordsFromDatabase = async () => {
  setQualityControlLoading(true);
  try {
    console.log('🔄 Loading quality control records from database...');
    const response = await qualityControlAPI.getAll();
    console.log('📋 Quality control records response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      setQualityControlRecords(response.data);
    } else {
      setQualityControlRecords([]);
    }
  } catch (error) {
    console.error('❌ Error loading quality control records:', error);
    setQualityControlRecords([]);
  } finally {
    setQualityControlLoading(false);
  }
};

const addQualityControlRecord = async (recordData) => {
  try {
    console.log('➕ Adding quality control record:', recordData);
    
    // Map frontend form data to backend expected format
    const dbRecordData = {
      batch_id: recordData.batchId,
      unit_id: recordData.unitId,
      test_date: recordData.testDate,
      fat: parseFloat(recordData.parameters.fat) || null,
      protein: parseFloat(recordData.parameters.protein) || null,
      moisture: parseFloat(recordData.parameters.moisture) || null,
      ph: parseFloat(recordData.parameters.ph) || null,
      result: recordData.result,
      inspector: recordData.inspector
    };
    
    const response = await qualityControlAPI.create(dbRecordData);
    if (response && response.success) {
      await loadQualityControlRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding quality control record:', error);
    throw error;
  }
};

const updateQualityControlRecord = async (recordId, recordData) => {
  try {
    console.log('✏️ Updating quality control record:', recordId, recordData);
    
    // Map frontend form data to backend expected format
    const dbRecordData = {
      batch_id: recordData.batchId,
      unit_id: recordData.unitId,
      test_date: recordData.testDate,
      fat: parseFloat(recordData.parameters.fat) || null,
      protein: parseFloat(recordData.parameters.protein) || null,
      moisture: parseFloat(recordData.parameters.moisture) || null,
      ph: parseFloat(recordData.parameters.ph) || null,
      result: recordData.result,
      inspector: recordData.inspector
    };
    
    const response = await qualityControlAPI.update(recordId, dbRecordData);
    if (response && response.success) {
      await loadQualityControlRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating quality control record:', error);
    throw error;
  }
};

const deleteQualityControlRecord = async (recordId) => {
  try {
    console.log('🗑️ Deleting quality control record:', recordId);
    const response = await qualityControlAPI.delete(recordId);
    if (response && response.success) {
      await loadQualityControlRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting quality control record:', error);
    throw error;
  }
};

  const updateInventoryOnMilkCollection = (quantity) => {
    setInventoryItems(prev => prev.map(item => 
      item.name === 'Fresh Toned Milk' 
        ? { ...item, quantity: (parseFloat(item.quantity) + parseFloat(quantity)).toString(), lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
  };
  // Maintenance Records CRUD Operations
const loadMaintenanceRecordsFromDatabase = async () => {
  setMaintenanceLoading(true);
  try {
    console.log('🔄 Loading maintenance records from database...');
    const response = await maintenanceAPI.getAll();
    console.log('🔧 Maintenance records response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      setMaintenanceRecords(response.data);
    } else {
      setMaintenanceRecords([]);
    }
  } catch (error) {
    console.error('❌ Error loading maintenance records:', error);
    setMaintenanceRecords([]);
  } finally {
    setMaintenanceLoading(false);
  }
};

const addMaintenanceRecord = async (recordData) => {
  try {
    console.log('➕ Adding maintenance record:', recordData);
    
    // Map frontend form data to backend expected format
    const dbRecordData = {
      unit_id: recordData.unitId,
      date: recordData.date,
      type: recordData.type,
      description: recordData.description,
      cost: parseFloat(recordData.cost) || 0,
      technician: recordData.technician,
      status: recordData.status
    };
    
    const response = await maintenanceAPI.create(dbRecordData);
    if (response && response.success) {
      await loadMaintenanceRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding maintenance record:', error);
    throw error;
  }
};

const updateMaintenanceRecord = async (recordId, recordData) => {
  try {
    console.log('✏️ Updating maintenance record:', recordId, recordData);
    
    // Map frontend form data to backend expected format
    const dbRecordData = {
      unit_id: recordData.unitId,
      date: recordData.date,
      type: recordData.type,
      description: recordData.description,
      cost: parseFloat(recordData.cost) || 0,
      technician: recordData.technician,
      status: recordData.status
    };
    
    const response = await maintenanceAPI.update(recordId, dbRecordData);
    if (response && response.success) {
      await loadMaintenanceRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating maintenance record:', error);
    throw error;
  }
};

const deleteMaintenanceRecord = async (recordId) => {
  try {
    console.log('🗑️ Deleting maintenance record:', recordId);
    const response = await maintenanceAPI.delete(recordId);
    if (response && response.success) {
      await loadMaintenanceRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting maintenance record:', error);
    throw error;
  }
};


  // ORIGINAL: All other helper functions (unchanged)
  const addInventoryItem = (newItem) => {
    setInventoryItems(prev => [newItem, ...prev]);
  };

  const updateInventoryItem = (index, updatedItem) => {
    setInventoryItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updatedItem, lastUpdated: new Date().toISOString().split('T')[0] };
      return updated;
    });
  };

  const deleteInventoryItem = (index) => {
    setInventoryItems(prev => prev.filter((_, i) => i !== index));
  };

  const addRetailer = (newRetailer) => {
    setRetailers(prev => [newRetailer, ...prev]);
  };

  const updateRetailer = (index, updatedRetailer) => {
    setRetailers(prev => {
      const updated = [...prev];
      updated[index] = updatedRetailer;
      return updated;
    });
  };

  const deleteRetailer = (index) => {
    setRetailers(prev => prev.filter((_, i) => i !== index));
  };

  const addSale = (newSale) => {
    setSales(prev => [newSale, ...prev]);
  };

  const updateSale = (index, updatedSale) => {
    setSales(prev => {
      const updated = [...prev];
      updated[index] = updatedSale;
      return updated;
    });
  };

  const deleteSale = (index) => {
    setSales(prev => prev.filter((_, i) => i !== index));
  };

  const updateEmployeeData = (newData) => {
    setEmployeeData(prev => ({ ...prev, ...newData }));
  };

  const updateProcessingData = (newData) => {
    setProcessingData(prev => ({ ...prev, ...newData }));
  };



  const calculateSustainabilityIndex = useMemo(() => {
    const metrics = {
      complianceRate: {
        weight: 0.40,
        calculate: () => {
          if (complianceRecords.length === 0) return 75;
          const compliantRecords = complianceRecords.filter(record => record.status === 'Compliant').length;
          return (compliantRecords / complianceRecords.length) * 100;
        }
      },
      certificationStatus: {
        weight: 0.25,
        calculate: () => {
          if (certifications.length === 0) return 70;
          const activeCertifications = certifications.filter(cert => cert.status === 'Active').length;
          return (activeCertifications / certifications.length) * 100;
        }
      },
      auditPerformance: {
        weight: 0.20,
        calculate: () => {
          const completedAudits = audits.filter(audit => audit.status === 'Completed' && audit.score > 0);
          if (completedAudits.length === 0) return 80;
          const averageScore = completedAudits.reduce((sum, audit) => sum + audit.score, 0) / completedAudits.length;
          return averageScore;
        }
      },
      environmentalCompliance: {
        weight: 0.10,
        calculate: () => {
          const environmentalTypes = ['Environmental Clearance', 'ISO Certification'];
          const environmentalRecords = complianceRecords.filter(record => 
            environmentalTypes.some(type => record.type.includes(type) || record.type.includes('Environmental'))
          );
          if (environmentalRecords.length === 0) return 85;
          const compliantEnvironmental = environmentalRecords.filter(record => record.status === 'Compliant').length;
          return (compliantEnvironmental / environmentalRecords.length) * 100;
        }
      },
      documentManagement: {
        weight: 0.05,
        calculate: () => {
          const recordsWithDocuments = complianceRecords.filter(record => record.documents && record.documents.length > 0).length;
          if (complianceRecords.length === 0) return 90;
          return (recordsWithDocuments / complianceRecords.length) * 100;
        }
      }
    };

    let totalScore = 0;
    Object.entries(metrics).forEach(([key, metric]) => {
      const score = metric.calculate();
      totalScore += score * metric.weight;
    });

    return Math.round(totalScore);
  }, [complianceRecords, certifications, audits]);

 
  

  const generateNetworkGrowthData = useMemo(() => {
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate);
      targetDate.setMonth(targetDate.getMonth() - i);
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;
      
      const farmersByMonth = farmers.filter(farmer => {
        if (!farmer.joinDate) return false;
        const joinDate = new Date(farmer.joinDate);
        return joinDate.getFullYear() < targetYear || 
               (joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 <= targetMonth);
      }).length;
      
      const suppliersByMonth = suppliers.filter(supplier => {
        if (!supplier.joinDate) return false;
        const joinDate = new Date(supplier.joinDate);
        return joinDate.getFullYear() < targetYear || 
               (joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 <= targetMonth);
      }).length;
      
      const newFarmersThisMonth = farmers.filter(farmer => {
        if (!farmer.joinDate) return false;
        const joinDate = new Date(farmer.joinDate);
        return joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 === targetMonth;
      }).length;
      
      const newSuppliersThisMonth = suppliers.filter(supplier => {
        if (!supplier.joinDate) return false;
        const joinDate = new Date(supplier.joinDate);
        return joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 === targetMonth;
      }).length;
      
      monthlyData.push({
        month: monthName,
        farmers: farmersByMonth,
        suppliers: suppliersByMonth,
        newFarmers: newFarmersThisMonth,
        newSuppliers: newSuppliersThisMonth,
        totalNetwork: farmersByMonth + suppliersByMonth
      });
    }
    
    return monthlyData;
  }, [farmers, suppliers]);

  // CRUD for Processing Units
const loadProcessingUnitsFromDatabase = async () => {
  try {
    const response = await processingUnitsAPI.getAll();
    if (response && response.success && Array.isArray(response.data)) {
      setProcessingUnits(response.data);
    } else {
      setProcessingUnits([]);
    }
  } catch (err) {
    setProcessingUnits([]);
  }
};

const addProcessingUnit = async (unitData) => {
  try {
    const dbUnit = {
      unit_id: unitData.id,
      name: unitData.name,
      location: unitData.location,
      manager: unitData.manager,
      contact: unitData.phone,
      capacity: parseInt(unitData.capacity) || 0,
      status: unitData.status,
      type: unitData.type
    };
    const response = await processingUnitsAPI.create(dbUnit);
    if (response && response.data && response.data.success) {
      await loadProcessingUnitsFromDatabase(); // <-- reloads the table
      return response;
    }
  } catch (error) {
    throw error;
  }
};

const updateProcessingUnit = async (idx, unitData) => {
  try {
    const unitId = processingUnits[idx].id;
    const dbUnit = {
      unit_id: unitData.id,
      name: unitData.name,
      location: unitData.location,
      manager: unitData.manager,
      contact: unitData.phone,
      capacity: parseInt(unitData.capacity) || 0,
      status: unitData.status,
      type: unitData.type
    };
    const response = await processingUnitsAPI.update(unitId, dbUnit);
    if (response && response.data && response.data.success) {
      setProcessingUnits(prev => {
        const updated = [...prev];
        updated[idx] = unitData;
        return updated;
      });
      return response;
    }
  } catch (error) {
    setProcessingUnits(prev => {
      const updated = [...prev];
      updated[idx] = unitData;
      return updated;
    });
    throw error;
  }
};

const deleteProcessingUnit = async (idx) => {
  try {
    const unitId = processingUnits[idx].id;
    await processingUnitsAPI.delete(unitId);
    setProcessingUnits(prev => prev.filter((_, i) => i !== idx));
  } catch (error) {
    setProcessingUnits(prev => prev.filter((_, i) => i !== idx));
    throw error;
  }
};

// CRUD for Production Batches
// Update the loadProductionBatchesFromDatabase function
const loadProductionBatchesFromDatabase = async () => {
  try {
    console.log('🔄 Loading production batches from database...');
    const response = await productionBatchesAPI.getAll();
    console.log('📦 Production batches response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      setProductionBatches(response.data);
    } else {
      setProductionBatches([]);
    }
  } catch (error) {
    console.error('❌ Error loading production batches:', error);
    setProductionBatches([]);
  }
};

// Update the addProductionBatch function
const addProductionBatch = async (batchData) => {
  try {
    console.log('➕ Adding production batch:', batchData);
    
    // Map frontend form data to backend expected format
    const dbBatchData = {
      batch_id: batchData.batchId,
      unit: batchData.unit,
      product: batchData.product,
      quantity: parseFloat(batchData.quantity),
      date: batchData.date,
      status: batchData.status,
      quality: batchData.quality || ''
    };
    
    const response = await productionBatchesAPI.create(dbBatchData);
    if (response && response.success) {
      await loadProductionBatchesFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding production batch:', error);
    throw error;
  }
};


const updateProductionBatch = async (idx, batch) => {
  try {
    const id = productionBatches[idx].id;
    console.log('✏️ Updating production batch:', id, batch);
    const response = await productionBatchesAPI.update(id, batch);
    if (response && response.success) {
      await loadProductionBatchesFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating production batch:', error);
    throw error;
  }
};

const deleteProductionBatch = async (idx) => {
  try {
    const id = productionBatches[idx].id;
    console.log('🗑️ Deleting production batch:', id);
    const response = await productionBatchesAPI.delete(id);
    if (response && response.success) {
      await loadProductionBatchesFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting production batch:', error);
    throw error;
  }
};
     // Retailers CRUD Operations with Total Sales Management
const loadRetailersFromDatabase = async () => {
  setRetailersLoading(true);
  try {
    console.log('🔄 Loading retailers from database...');
    const response = await retailersAPI.getAll();
    console.log('🏪 Retailers response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      // Map backend data to frontend format
      const formattedRetailers = response.data.map(retailer => ({
        id: retailer.id,
        name: retailer.name,
        location: retailer.location,
        contact: retailer.contact,
        totalSales: retailer.total_sales || 0 // Map total_sales to totalSales
      }));
      setRetailersFromDB(formattedRetailers);
    } else {
      setRetailersFromDB([]);
    }
  } catch (error) {
    console.error('❌ Error loading retailers:', error);
    setRetailersFromDB([]);
  } finally {
    setRetailersLoading(false);
  }
};

const addRetailerToDB = async (retailerData) => {
  try {
    console.log('➕ Adding retailer:', retailerData);
    
    // Map frontend data to backend format
    const dbRetailerData = {
      name: retailerData.name,
      location: retailerData.location,
      contact: retailerData.contact,
      total_sales: 0 // Start with 0 total sales
    };
    
    const response = await retailersAPI.create(dbRetailerData);
    if (response && response.success) {
      await loadRetailersFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding retailer:', error);
    throw error;
  }
};

const updateRetailerInDB = async (retailerId, retailerData) => {
  try {
    console.log('✏️ Updating retailer:', retailerId, retailerData);
    
    // Get current retailer data to preserve total_sales
    const currentRetailer = retailersFromDB.find(r => r.id === retailerId);
    
    const dbRetailerData = {
      name: retailerData.name,
      location: retailerData.location,
      contact: retailerData.contact,
      total_sales: currentRetailer ? currentRetailer.totalSales : 0
    };
    
    const response = await retailersAPI.update(retailerId, dbRetailerData);
    if (response && response.success) {
      await loadRetailersFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating retailer:', error);
    throw error;
  }
};

const deleteRetailerFromDB = async (retailerId) => {
  try {
    console.log('🗑️ Deleting retailer:', retailerId);
    const response = await retailersAPI.delete(retailerId);
    if (response && response.success) {
      await loadRetailersFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting retailer:', error);
    throw error;
  }
};

// Sales CRUD Operations that Auto-Update Retailer Totals
const loadSalesFromDatabase = async () => {
  setSalesLoading(true);
  try {
    console.log('🔄 Loading sales from database...');
    const response = await salesAPI.getAll();
    console.log('💰 Sales response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      setSalesFromDB(response.data);
    } else {
      setSalesFromDB([]);
    }
  } catch (error) {
    console.error('❌ Error loading sales:', error);
    setSalesFromDB([]);
  } finally {
    setSalesLoading(false);
  }
};

const addSaleToDB = async (saleData) => {
  try {
    console.log('➕ Adding sale:', saleData);
    const response = await salesAPI.create(saleData);
    if (response && response.success) {
      await loadSalesFromDatabase();
      await loadRetailersFromDatabase(); // Refresh retailers to get updated totals
    }
  } catch (error) {
    console.error('❌ Error adding sale:', error);
    throw error;
  }
};

const updateSaleInDB = async (saleId, saleData) => {
  try {
    console.log('✏️ Updating sale:', saleId, saleData);
    const response = await salesAPI.update(saleId, saleData);
    if (response && response.success) {
      await loadSalesFromDatabase();
      await loadRetailersFromDatabase(); // Refresh retailers to get updated totals
    }
  } catch (error) {
    console.error('❌ Error updating sale:', error);
    throw error;
  }
};

const deleteSaleFromDB = async (saleId) => {
  try {
    console.log('🗑️ Deleting sale:', saleId);
    const response = await salesAPI.delete(saleId);
    if (response && response.success) {
      await loadSalesFromDatabase();
      await loadRetailersFromDatabase(); // Refresh retailers to get updated totals
    }
  } catch (error) {
    console.error('❌ Error deleting sale:', error);
    throw error;
  }
}; 
    // Inventory Records CRUD Operations
const loadInventoryRecordsFromDatabase = async () => {
  setInventoryLoading(true);
  try {
    console.log('🔄 Loading inventory records from database...');
    const response = await inventoryAPI.getAll();
    console.log('📦 Inventory records response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      // Map backend data to frontend format to maintain compatibility
      const formattedInventory = response.data.map(item => ({
        id: item.id,
        code: item.item_code,
        name: item.item_name,
        category: item.category,
        quantity: item.current_stock_level.toString(),
        unit: item.unit,
        minStock: item.minimum_stock_level.toString(),
        maxStock: item.maximum_stock_level.toString(),
        location: item.location,
        status: item.status,
        lastUpdated: item.last_updated,
        supplier: item.supplier
      }));
      setInventoryRecords(formattedInventory);
    } else {
      setInventoryRecords([]);
    }
  } catch (error) {
    console.error('❌ Error loading inventory records:', error);
    setInventoryRecords([]);
  } finally {
    setInventoryLoading(false);
  }
};

const addInventoryRecordToDB = async (recordData) => {
  try {
    console.log('➕ Adding inventory record:', recordData);
    
    // Map frontend form data to backend expected format
    const dbRecordData = {
      item_code: recordData.code,
      item_name: recordData.name,
      category: recordData.category,
      current_stock_level: parseFloat(recordData.quantity) || 0,
      unit: recordData.unit,
      minimum_stock_level: parseFloat(recordData.minStock) || 0,
      maximum_stock_level: parseFloat(recordData.maxStock) || 0,
      location: recordData.location,
      status: recordData.status,
      last_updated: recordData.lastUpdated,
      supplier: recordData.supplier
    };
    
    const response = await inventoryAPI.create(dbRecordData);
    if (response && response.success) {
      await loadInventoryRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding inventory record:', error);
    throw error;
  }
};

const updateInventoryRecordInDB = async (recordId, recordData) => {
  try {
    console.log('✏️ Updating inventory record:', recordId, recordData);
    
    // Map frontend form data to backend expected format
    const dbRecordData = {
      item_code: recordData.code,
      item_name: recordData.name,
      category: recordData.category,
      current_stock_level: parseFloat(recordData.quantity) || 0,
      unit: recordData.unit,
      minimum_stock_level: parseFloat(recordData.minStock) || 0,
      maximum_stock_level: parseFloat(recordData.maxStock) || 0,
      location: recordData.location,
      status: recordData.status,
      last_updated: recordData.lastUpdated,
      supplier: recordData.supplier
    };
    
    const response = await inventoryAPI.update(recordId, dbRecordData);
    if (response && response.success) {
      await loadInventoryRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating inventory record:', error);
    throw error;
  }
};

const deleteInventoryRecordFromDB = async (recordId) => {
  try {
    console.log('🗑️ Deleting inventory record:', recordId);
    const response = await inventoryAPI.delete(recordId);
    if (response && response.success) {
      await loadInventoryRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting inventory record:', error);
    throw error;
  }
}; 
     // Employee CRUD Operations
const loadEmployeesFromDatabase = async () => {
  setEmployeesLoading(true);
  try {
    console.log('🔄 Loading employees from database...');
    const response = await employeeAPI.getAll();
    console.log('👥 Employees response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      // Map backend data to frontend format
      const formattedEmployees = response.data.map(emp => ({
        id: emp.id,
        employeeId: emp.employee_id,
        name: emp.name,
        position: emp.position,
        department: emp.department,
        phone: emp.phone,
        email: emp.email,
        salary: emp.salary.toString(),
        joinDate: emp.join_date,
        status: emp.status,
        address: emp.address,
        emergencyContact: emp.emergency_contact,
        experience: emp.experience ? emp.experience.toString() : '',
        qualification: emp.qualification,
        bloodGroup: emp.blood_group,
        dateOfBirth: emp.date_of_birth
      }));
      setEmployeesFromDB(formattedEmployees);
    } else {
      setEmployeesFromDB([]);
    }
  } catch (error) {
    console.error('❌ Error loading employees:', error);
    setEmployeesFromDB([]);
  } finally {
    setEmployeesLoading(false);
  }
};

const addEmployeeToDB = async (employeeData) => {
  try {
    console.log('➕ Adding employee:', employeeData);
    
    // Map frontend form data to backend expected format
    const dbEmployeeData = {
      employee_id: employeeData.id,
      name: employeeData.name,
      position: employeeData.position,
      department: employeeData.department,
      phone: employeeData.phone,
      email: employeeData.email,
      salary: parseFloat(employeeData.salary) || 0,
      join_date: employeeData.joinDate,
      status: employeeData.status,
      address: employeeData.address,
      emergency_contact: employeeData.emergencyContact,
      experience: employeeData.experience ? parseInt(employeeData.experience) : null,
      qualification: employeeData.qualification,
      blood_group: employeeData.bloodGroup,
      date_of_birth: employeeData.dateOfBirth
    };
    
    const response = await employeeAPI.create(dbEmployeeData);
    if (response && response.success) {
      await loadEmployeesFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding employee:', error);
    throw error;
  }
};

const updateEmployeeInDB = async (employeeId, employeeData) => {
  try {
    console.log('✏️ Updating employee:', employeeId, employeeData);
    
    // Map frontend form data to backend expected format
    const dbEmployeeData = {
      employee_id: employeeData.id,
      name: employeeData.name,
      position: employeeData.position,
      department: employeeData.department,
      phone: employeeData.phone,
      email: employeeData.email,
      salary: parseFloat(employeeData.salary) || 0,
      join_date: employeeData.joinDate,
      status: employeeData.status,
      address: employeeData.address,
      emergency_contact: employeeData.emergencyContact,
      experience: employeeData.experience ? parseInt(employeeData.experience) : null,
      qualification: employeeData.qualification,
      blood_group: employeeData.bloodGroup,
      date_of_birth: employeeData.dateOfBirth
    };
    
    const response = await employeeAPI.update(employeeId, dbEmployeeData);
    if (response && response.success) {
      await loadEmployeesFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    throw error;
  }
};

const deleteEmployeeFromDB = async (employeeId) => {
  try {
    console.log('🗑️ Deleting employee:', employeeId);
    const response = await employeeAPI.delete(employeeId);
    if (response && response.success) {
      await loadEmployeesFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting employee:', error);
    throw error;
  }
}; 
  // Payment CRUD Operations
const loadPaymentsFromDatabase = async () => {
  setPaymentsLoading(true);
  try {
    console.log('🔄 Loading payments from database...');
    const response = await paymentsAPI.getAll();
    console.log('💳 Payments response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      // Map backend data to frontend format
      const formattedPayments = response.data.map(payment => ({
        id: payment.id,
        farmerId: payment.farmer_id,
        paymentDate: payment.payment_date,
        amount: payment.amount.toString(),
        paymentMode: payment.payment_mode,
        remarks: payment.remarks,
        status: payment.status,
        transactionId: payment.transaction_id
      }));
      setPaymentsFromDB(formattedPayments);
    } else {
      setPaymentsFromDB([]);
    }
  } catch (error) {
    console.error('❌ Error loading payments:', error);
    setPaymentsFromDB([]);
  } finally {
    setPaymentsLoading(false);
  }
};

const addPaymentToDB = async (paymentData) => {
  try {
    console.log('➕ Adding payment:', paymentData);
    
    // Map frontend form data to backend expected format
    const dbPaymentData = {
      farmer_id: paymentData.farmerId,
      payment_date: paymentData.paymentDate,
      amount: parseFloat(paymentData.amount) || 0,
      payment_mode: paymentData.paymentMode,
      remarks: paymentData.remarks,
      status: paymentData.status,
      transaction_id: paymentData.transactionId
    };
    
    const response = await paymentsAPI.create(dbPaymentData);
    if (response && response.success) {
      await loadPaymentsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding payment:', error);
    throw error;
  }
};

const updatePaymentInDB = async (paymentId, paymentData) => {
  try {
    console.log('✏️ Updating payment:', paymentId, paymentData);
    
    // Map frontend form data to backend expected format
    const dbPaymentData = {
      farmer_id: paymentData.farmerId,
      payment_date: paymentData.paymentDate,
      amount: parseFloat(paymentData.amount) || 0,
      payment_mode: paymentData.paymentMode,
      remarks: paymentData.remarks,
      status: paymentData.status,
      transaction_id: paymentData.transactionId
    };
    
    const response = await paymentsAPI.update(paymentId, dbPaymentData);
    if (response && response.success) {
      await loadPaymentsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating payment:', error);
    throw error;
  }
};

const deletePaymentFromDB = async (paymentId) => {
  try {
    console.log('🗑️ Deleting payment:', paymentId);
    const response = await paymentsAPI.delete(paymentId);
    if (response && response.success) {
      await loadPaymentsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting payment:', error);
    throw error;
  }
};

// Bills CRUD Operations
const loadBillsFromDatabase = async () => {
  setBillsLoading(true);
  try {
    console.log('🔄 Loading bills from database...');
    const response = await billsAPI.getAll();
    console.log('🧾 Bills response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      // Map backend data to frontend format
      const formattedBills = response.data.map(bill => ({
        id: bill.id,
        billId: bill.bill_id,
        farmerId: bill.farmer_id,
        billDate: bill.bill_date,
        dueDate: bill.due_date,
        amount: bill.amount.toString(),
        description: bill.description,
        status: bill.status,
        category: bill.category
      }));
      setBillsFromDB(formattedBills);
    } else {
      setBillsFromDB([]);
    }
  } catch (error) {
    console.error('❌ Error loading bills:', error);
    setBillsFromDB([]);
  } finally {
    setBillsLoading(false);
  }
};

const addBillToDB = async (billData) => {
  try {
    console.log('➕ Adding bill:', billData);
    
    // Map frontend form data to backend expected format
    const dbBillData = {
      bill_id: billData.billId,
      farmer_id: billData.farmerId,
      bill_date: billData.billDate,
      due_date: billData.dueDate,
      amount: parseFloat(billData.amount) || 0,
      description: billData.description,
      status: billData.status,
      category: billData.category
    };
    
    const response = await billsAPI.create(dbBillData);
    if (response && response.success) {
      await loadBillsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding bill:', error);
    throw error;
  }
};

const updateBillInDB = async (billId, billData) => {
  try {
    console.log('✏️ Updating bill:', billId, billData);
    
    // Map frontend form data to backend expected format
    const dbBillData = {
      bill_id: billData.billId,
      farmer_id: billData.farmerId,
      bill_date: billData.billDate,
      due_date: billData.dueDate,
      amount: parseFloat(billData.amount) || 0,
      description: billData.description,
      status: billData.status,
      category: billData.category
    };
    
    const response = await billsAPI.update(billId, dbBillData);
    if (response && response.success) {
      await loadBillsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating bill:', error);
    throw error;
  }
};

const deleteBillFromDB = async (billId) => {
  try {
    console.log('🗑️ Deleting bill:', billId);
    const response = await billsAPI.delete(billId);
    if (response && response.success) {
      await loadBillsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting bill:', error);
    throw error;
  }
};
 const loadLabQualityTestsFromDatabase = async () => {
  setLabQualityTestsLoading(true);
  try {
    console.log('🔄 Loading lab quality tests from database...');
    const response = await labQualityTestsAPI.getAll();
    console.log('📋 Lab quality tests response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      setLabQualityTests(response.data);
      console.log('✅ Lab quality tests loaded successfully:', response.data.length);
    } else {
      console.warn('⚠️ Invalid response format:', response);
      setLabQualityTests([]);
    }
  } catch (error) {
    console.error('❌ Error loading lab quality tests:', error);
    setError('Failed to load lab quality tests: ' + error.message);
    setLabQualityTests([]);
  } finally {
    setLabQualityTestsLoading(false);
  }
};

const addLabQualityTest = async (form) => {
  const dbRecordData = {
    batch_id: form.batchId,
    sample_id: form.sampleId,
    farmer_id: form.farmerId,
    test_date: form.testDate,
    test_type: form.testType,
    fat_content: parseFloat(form.fatContent) || null,
    protein_content: parseFloat(form.proteinContent) || null,
    lactose_content: parseFloat(form.lactoseContent) || null,
    snf_content: parseFloat(form.snfContent) || null,
    ph_level: parseFloat(form.phLevel) || null,
    bacteria_count: parseInt(form.bacteriaCount) || null,
    adulteration: form.adulteration,
    overall_grade: form.overallGrade,
    status: form.status,
    remarks: form.remarks,
    tested_by: form.testedBy
  };
  await labQualityTestsAPI.create(dbRecordData);
  await loadLabQualityTestsFromDatabase();
};

const updateLabQualityTest = async (id, form) => {
  const dbRecordData = {
    batch_id: form.batchId,
    sample_id: form.sampleId,
    farmer_id: form.farmerId,
    test_date: form.testDate,
    test_type: form.testType,
    fat_content: parseFloat(form.fatContent) || null,
    protein_content: parseFloat(form.proteinContent) || null,
    lactose_content: parseFloat(form.lactoseContent) || null,
    snf_content: parseFloat(form.snfContent) || null,
    ph_level: parseFloat(form.phLevel) || null,
    bacteria_count: parseInt(form.bacteriaCount) || null,
    adulteration: form.adulteration,
    overall_grade: form.overallGrade,
    status: form.status,
    remarks: form.remarks,
    tested_by: form.testedBy
  };
  await labQualityTestsAPI.update(id, dbRecordData);
  await loadLabQualityTestsFromDatabase();
};

const deleteLabQualityTest = async (id) => {
  await labQualityTestsAPI.delete(id);
  await loadLabQualityTestsFromDatabase();
};

const loadReviewsFromDatabase = async () => {
  setReviewsLoading(true);
  try {
    setReviewsError(null);
    const response = await reviewsAPI.getAll();
    if (response && response.success && Array.isArray(response.data)) {
      setReviews(response.data.map(r => ({
        id: r.id,
        customerName: r.customer_name,
        customerEmail: r.customer_email,
        category: r.category,
        rating: r.rating,
        subject: r.subject,
        comment: r.comment,
        date: r.date,
        status: r.status,
        response: r.response,
        responseDate: r.response_date
      })));
    } else {
      setReviews([]);
    }
  } catch (err) {
    setReviewsError(err.message || 'Failed to load reviews');
    setReviews([]);
  } finally {
    setReviewsLoading(false);
  }
};

const addReview = async (reviewData) => {
  try {
    const dbReview = {
      id: reviewData.id,
      customer_name: reviewData.customerName,
      customer_email: reviewData.customerEmail,
      category: reviewData.category,
      rating: reviewData.rating,
      subject: reviewData.subject,
      comment: reviewData.comment,
      date: reviewData.date,
      status: reviewData.status,
      response: reviewData.response,
      response_date: reviewData.responseDate
    };
    const response = await reviewsAPI.create(dbReview);
    if (response && response.success) {
      const newReview = {
        id: response.data.id,
        customerName: response.data.customer_name,
        customerEmail: response.data.customer_email,
        category: response.data.category,
        rating: response.data.rating,
        subject: response.data.subject,
        comment: response.data.comment,
        date: response.data.date,
        status: response.data.status,
        response: response.data.response,
        responseDate: response.data.response_date
      };
      setReviews(prev => [newReview, ...prev]);
      return response;
    }
  } catch (error) {
    setReviews(prev => [reviewData, ...prev]);
    throw error;
  }
};

const updateReview = async (index, reviewData) => {
  try {
    const reviewId = reviews[index].id;
    
    // Complete backend mapping with ALL fields
    const dbReview = {
      customer_name: reviewData.customerName,
      customer_email: reviewData.customerEmail,
      category: reviewData.category,
      rating: reviewData.rating,
      subject: reviewData.subject,
      comment: reviewData.comment,
      date: reviewData.date,
      status: reviewData.status,
      response: reviewData.response || null,
      response_date: reviewData.responseDate || null
    };

    console.log('Updating review with data:', dbReview);

    const response = await reviewsAPI.update(reviewId, dbReview);
    
    if (response && response.success) {
      const updatedReview = {
        id: response.data.id,
        customerName: response.data.customer_name,
        customerEmail: response.data.customer_email,
        category: response.data.category,
        rating: response.data.rating,
        subject: response.data.subject,
        comment: response.data.comment,
        date: response.data.date,
        status: response.data.status,
        response: response.data.response,
        responseDate: response.data.response_date
      };

      setReviews(prev => {
        const updated = [...prev];
        updated[index] = updatedReview;
        return updated;
      });

      console.log('Review updated successfully in state');
      return response;
    }
  } catch (error) {
    console.error('Error in updateReview:', error);
    
    // Fallback: update local state even if API fails
    setReviews(prev => {
      const updated = [...prev];
      updated[index] = reviewData;
      return updated;
    });
    
    throw error;
  }
};

const deleteReview = async (index) => {
  try {
    const reviewId = reviews[index].id;
    await reviewsAPI.delete(reviewId);
    setReviews(prev => prev.filter((_, i) => i !== index));
  } catch (error) {
    setReviews(prev => prev.filter((_, i) => i !== index));
    throw error;
  }
}; 
  // Farmer Feedback CRUD Operations
const loadFarmerFeedbackFromDatabase = async () => {
    setFarmerFeedbackLoading(true);
    try {
        console.log('🔄 Loading farmer feedback from database...');
        const response = await farmerFeedbackAPI.getAll();
        console.log('📋 Farmer feedback response:', response);
        if (response && response.success && Array.isArray(response.data)) {
            // Map backend data to frontend format
            const formattedFeedback = response.data.map(feedback => ({
                id: feedback.id,
                farmerName: feedback.farmer_name,
                farmerId: feedback.farmer_id,
                feedbackType: feedback.feedback_type,
                rating: feedback.rating,
                message: feedback.message,
                date: feedback.date,
                priority: feedback.priority,
                status: feedback.status
            }));
            setFarmerFeedback(formattedFeedback);
        } else {
            setFarmerFeedback([]);
        }
    } catch (error) {
        console.error('❌ Error loading farmer feedback:', error);
        setFarmerFeedbackError(error.message);
        setFarmerFeedback([]);
    } finally {
        setFarmerFeedbackLoading(false);
    }
};

const addFarmerFeedback = async (feedbackData) => {
    try {
        console.log('➕ Adding farmer feedback:', feedbackData);
        // Map frontend form data to backend expected format
        const dbFeedbackData = {
            id: feedbackData.id,
            farmer_name: feedbackData.farmerName,
            farmer_id: feedbackData.farmerId,
            feedback_type: feedbackData.feedbackType,
            rating: feedbackData.rating,
            message: feedbackData.message,
            date: feedbackData.date,
            priority: feedbackData.priority,
            status: feedbackData.status
        };

        const response = await farmerFeedbackAPI.create(dbFeedbackData);
        if (response && response.success) {
            await loadFarmerFeedbackFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error adding farmer feedback:', error);
        throw error;
    }
};

const updateFarmerFeedback = async (feedbackId, feedbackData) => {
    try {
        console.log('✏️ Updating farmer feedback:', feedbackId, feedbackData);
        // Map frontend form data to backend expected format
        const dbFeedbackData = {
            farmer_name: feedbackData.farmerName,
            farmer_id: feedbackData.farmerId,
            feedback_type: feedbackData.feedbackType,
            rating: feedbackData.rating,
            message: feedbackData.message,
            date: feedbackData.date,
            priority: feedbackData.priority,
            status: feedbackData.status
        };

        const response = await farmerFeedbackAPI.update(feedbackId, dbFeedbackData);
        if (response && response.success) {
            await loadFarmerFeedbackFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error updating farmer feedback:', error);
        throw error;
    }
};

const deleteFarmerFeedback = async (feedbackId) => {
    try {
        console.log('🗑️ Deleting farmer feedback:', feedbackId);
        const response = await farmerFeedbackAPI.delete(feedbackId);
        if (response && response.success) {
            await loadFarmerFeedbackFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error deleting farmer feedback:', error);
        throw error;
    }
};
 // Message CRUD Operations - ADD THIS ENTIRE SECTION
const loadMessagesFromDatabase = async () => {
  setMessagesLoading(true);
  try {
    console.log('🔄 Loading messages from database...');
    const response = await messagesAPI.getAll();
    console.log('📨 Messages response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      const formattedMessages = response.data.map(message => ({
        id: message.id,
        farmerId: message.farmer_id,
        subject: message.subject,
        message: message.message,
        timestamp: message.timestamp,
        status: message.status,
        priority: message.priority
      }));
      setMessages(formattedMessages);
      console.log('✅ Messages loaded successfully:', formattedMessages.length);
    } else {
      console.warn('⚠️ Invalid messages response format:', response);
      setMessages([]);
    }
  } catch (error) {
    console.error('❌ Error loading messages:', error);
    setMessagesError(error.message || 'Failed to load messages');
    setMessages([]);
  } finally {
    setMessagesLoading(false);
  }
};

const addMessage = async (messageData) => {
  try {
    console.log('➕ Adding message:', messageData);
    const dbMessageData = {
      id: messageData.id,
      farmer_id: messageData.farmerId,
      subject: messageData.subject,
      message: messageData.message,
      timestamp: messageData.timestamp,
      status: messageData.status,
      priority: messageData.priority
    };

    const response = await messagesAPI.create(dbMessageData);
    if (response && response.success) {
      await loadMessagesFromDatabase(); // Reload to get latest data
    }
  } catch (error) {
    console.error('❌ Error adding message:', error);
    throw error;
  }
};

const updateMessage = async (messageId, messageData) => {
  try {
    console.log('✏️ Updating message:', messageId, messageData);
    const dbMessageData = {
      farmer_id: messageData.farmerId,
      subject: messageData.subject,
      message: messageData.message,
      timestamp: messageData.timestamp,
      status: messageData.status,
      priority: messageData.priority
    };

    const response = await messagesAPI.update(messageId, dbMessageData);
    if (response && response.success) {
      await loadMessagesFromDatabase(); // Reload to get latest data
    }
  } catch (error) {
    console.error('❌ Error updating message:', error);
    throw error;
  }
};

const deleteMessage = async (messageId) => {
  try {
    console.log('🗑️ Deleting message:', messageId);
    const response = await messagesAPI.delete(messageId);
    if (response && response.success) {
      await loadMessagesFromDatabase(); // Reload to get latest data
    }
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    throw error;
  }
};

const updateMessageStatus = async (messageId, status) => {
  try {
    console.log('🔄 Updating message status:', messageId, status);
    const response = await messagesAPI.updateStatus(messageId, status);
    if (response && response.success) {
      await loadMessagesFromDatabase(); // Reload to get latest data
    }
  } catch (error) {
    console.error('❌ Error updating message status:', error);
    throw error;
  }
};
const loadAnnouncementsFromDatabase = async () => {
  setAnnouncementsLoading(true);
  setAnnouncementsError(null);
  try {
    const response = await announcementsAPI.getAll();
    if (response && response.success && Array.isArray(response.data)) {
      // Normalize DB -> UI format (snake_case to camelCase)
      const normalized = response.data.map(announcement => ({
        id: announcement.id || '',
        title: announcement.title || '',
        content: announcement.content || '',
        targetAudience: announcement.target_audience || '',
        priority: announcement.priority || 'Medium',
        publishDate: announcement.publish_date || '',
        status: announcement.status || 'Draft',
        views: announcement.views || 0
      }));
      setAnnouncements(normalized);
    } else {
      throw new Error('Invalid announcements data');
    }
  } catch (err) {
    setAnnouncementsError(err.message || 'Failed to load announcements');
    setAnnouncements([]);
  } finally {
    setAnnouncementsLoading(false);
  }
};

// Add
const addAnnouncement = async (announcementData) => {
  try {
    // Convert camelCase UI -> DB format
    const dbAnnouncement = {
      id: announcementData.id,
      title: announcementData.title,
      content: announcementData.content,
      target_audience: announcementData.targetAudience,
      priority: announcementData.priority,
      publish_date: announcementData.publishDate,
      status: announcementData.status,
      views: announcementData.views || 0
    };
    const response = await announcementsAPI.create(dbAnnouncement);
    if (response && response.success) {
      await loadAnnouncementsFromDatabase();
      return response;
    }
  } catch (error) {
    throw error;
  }
};

// Update
const updateAnnouncement = async (index, announcementData) => {
  try {
    const id = announcements[index].id;
    const dbAnnouncement = {
      title: announcementData.title,
      content: announcementData.content,
      target_audience: announcementData.targetAudience,
      priority: announcementData.priority,
      publish_date: announcementData.publishDate,
      status: announcementData.status,
      views: announcementData.views || 0
    };
    const response = await announcementsAPI.update(id, dbAnnouncement);
    if (response && response.success) {
      await loadAnnouncementsFromDatabase();
      return response;
    }
  } catch (error) {
    throw error;
  }
};

// Delete
const deleteAnnouncement = async (index) => {
  try {
    const id = announcements[index].id;
    await announcementsAPI.delete(id);
    await loadAnnouncementsFromDatabase();
  } catch (error) {
    throw error;
  }
};
const loadGroupMessagesFromDatabase = async () => {
  setGroupMessagesLoading(true);
  setGroupMessagesError(null);
  try {
    console.log('🔄 Loading group messages from database...');
    const response = await groupMessagesAPI.getAll();
    console.log('💬 Group messages response:', response);
    
    if (response && response.success && Array.isArray(response.data)) {
      // Map backend data to frontend format
      const formattedMessages = response.data.map(msg => ({
        id: msg.id,
        groupName: msg.group_name || '',
        message: msg.message || '',
        senderName: msg.sender_name || '',
        memberCount: msg.member_count || 0,
        timestamp: msg.timestamp || ''
      }));
      setGroupMessages(formattedMessages);
    } else {
      setGroupMessages([]);
    }
  } catch (error) {
    console.error('❌ Error loading group messages:', error);
    setGroupMessagesError(error.message || 'Failed to load group messages');
    setGroupMessages([]);
  } finally {
    setGroupMessagesLoading(false);
  }
};

const addGroupMessage = async (messageData) => {
  try {
    console.log('➕ Adding group message:', messageData);
    // Map frontend format to backend format
    const dbMessageData = {
      group_name: messageData.groupName,
      message: messageData.message,
      sender_name: messageData.senderName,
      member_count: parseInt(messageData.memberCount) || 0,
      timestamp: messageData.timestamp
    };

    const response = await groupMessagesAPI.create(dbMessageData);
    if (response && response.success) {
      await loadGroupMessagesFromDatabase(); // Reload to get latest data
    }
  } catch (error) {
    console.error('❌ Error adding group message:', error);
    throw error;
  }
};

const updateGroupMessageInDB = async (messageId, messageData) => {
  try {
    console.log('✏️ Updating group message:', messageId, messageData);
    // Map frontend format to backend format
    const dbMessageData = {
      group_name: messageData.groupName,
      message: messageData.message,
      sender_name: messageData.senderName,
      member_count: parseInt(messageData.memberCount) || 0,
      timestamp: messageData.timestamp
    };

    const response = await groupMessagesAPI.update(messageId, dbMessageData);
    if (response && response.success) {
      await loadGroupMessagesFromDatabase(); // Reload to get latest data
    }
  } catch (error) {
    console.error('❌ Error updating group message:', error);
    throw error;
  }
};

const deleteGroupMessageFromDB = async (messageId) => {
  try {
    console.log('🗑️ Deleting group message:', messageId);
    const response = await groupMessagesAPI.delete(messageId);
    if (response && response.success) {
      await loadGroupMessagesFromDatabase(); // Reload to get latest data
    }
  } catch (error) {
    console.error('❌ Error deleting group message:', error);
    throw error;
  }
};

const loadComplianceRecordsFromDatabase = async () => {
  setComplianceRecordsLoading(true);
  try {
    console.log('🔄 Loading compliance records from database...');
    const response = await complianceRecordsAPI.getAll();
    console.log('📋 Compliance records response:', response);
    if (response && response.success && Array.isArray(response.data)) {
      const formattedRecords = response.data.map(record => ({
        id: record.id,
        type: record.type,
        title: record.title,
        description: record.description,
        status: record.status,
        priority: record.priority,
        dueDate: record.due_date,
        completedDate: record.completed_date,
        assignedTo: record.assigned_to,
        responsibleDepartment: record.responsible_department,
        complianceOfficer: record.compliance_officer,
        regulatoryBody: record.regulatory_body,
        licenseNumber: record.license_number,
        validityPeriod: record.validity_period,
        renewalDate: record.renewal_date,
        cost: record.cost ? record.cost.toString() : '',
        remarks: record.remarks,
        riskLevel: record.risk_level,
        businessImpact: record.business_impact,
        documents: []
      }));
      setComplianceRecords(formattedRecords);
    } else {
      setComplianceRecords([]);
    }
  } catch (error) {
    console.error('❌ Error loading compliance records:', error);
    setComplianceRecords([]);
  } finally {
    setComplianceRecordsLoading(false);
  }
};

const addComplianceRecord = async (recordData) => {
  try {
    console.log('➕ Adding compliance record:', recordData);
    const dbRecordData = {
      id: recordData.id,
      type: recordData.type,
      title: recordData.title,
      description: recordData.description,
      status: recordData.status,
      priority: recordData.priority,
      due_date: recordData.dueDate,
      completed_date: recordData.completedDate || null,
      assigned_to: recordData.assignedTo,
      responsible_department: recordData.responsibleDepartment,
      compliance_officer: recordData.complianceOfficer,
      regulatory_body: recordData.regulatoryBody,
      license_number: recordData.licenseNumber,
      validity_period: recordData.validityPeriod,
      renewal_date: recordData.renewalDate || null,
      cost: recordData.cost ? parseFloat(recordData.cost) : null,
      remarks: recordData.remarks,
      risk_level: recordData.riskLevel,
      business_impact: recordData.businessImpact
    };

    const response = await complianceRecordsAPI.create(dbRecordData);
    if (response && response.success) {
      await loadComplianceRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding compliance record:', error);
    throw error;
  }
};

const updateComplianceRecord = async (recordId, recordData) => {
  try {
    console.log('✏️ Updating compliance record:', recordId, recordData);
    const dbRecordData = {
      type: recordData.type,
      title: recordData.title,
      description: recordData.description,
      status: recordData.status,
      priority: recordData.priority,
      due_date: recordData.dueDate,
      completed_date: recordData.completedDate || null,
      assigned_to: recordData.assignedTo,
      responsible_department: recordData.responsibleDepartment,
      compliance_officer: recordData.complianceOfficer,
      regulatory_body: recordData.regulatoryBody,
      license_number: recordData.licenseNumber,
      validity_period: recordData.validityPeriod,
      renewal_date: recordData.renewalDate || null,
      cost: recordData.cost ? parseFloat(recordData.cost) : null,
      remarks: recordData.remarks,
      risk_level: recordData.riskLevel,
      business_impact: recordData.businessImpact
    };

    const response = await complianceRecordsAPI.update(recordId, dbRecordData);
    if (response && response.success) {
      await loadComplianceRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating compliance record:', error);
    throw error;
  }
};

const deleteComplianceRecord = async (recordId) => {
  try {
    console.log('🗑️ Deleting compliance record:', recordId);
    const response = await complianceRecordsAPI.delete(recordId);
    if (response && response.success) {
      await loadComplianceRecordsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting compliance record:', error);
    throw error;
  }
};

const loadCertificationsFromDatabase = async () => {
  setCertificationsLoading(true);
  try {
    console.log('🔄 Loading certifications from database...');
    const response = await certificationsAPI.getAll();
    console.log('📋 Certifications response:', response);
    if (response && response.success && Array.isArray(response.data)) {
      const formattedCertifications = response.data.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuingAuthority: cert.issuing_authority,
        certificateNumber: cert.certificate_number,
        issueDate: cert.issue_date,
        expiryDate: cert.expiry_date,
        status: cert.status,
        renewalRequired: cert.renewal_required,
        documentPath: cert.document_path,
        scope: cert.scope,
        accreditationBody: cert.accreditation_body,
        surveillanceDate: cert.surveillance_date,
        cost: cert.cost ? cert.cost.toString() : '',
        validityPeriod: cert.validity_period,
        benefits: cert.benefits,
        maintenanceRequirements: cert.maintenance_requirements
      }));
      setCertifications(formattedCertifications);
    } else {
      setCertifications([]);
    }
  } catch (error) {
    console.error('❌ Error loading certifications:', error);
    setCertifications([]);
  } finally {
    setCertificationsLoading(false);
  }
};

const addCertification = async (certData) => {
  try {
    console.log('➕ Adding certification:', certData);
    const dbCertData = {
      id: certData.id,
      name: certData.name,
      issuing_authority: certData.issuingAuthority,
      certificate_number: certData.certificateNumber,
      issue_date: certData.issueDate,
      expiry_date: certData.expiryDate,
      status: certData.status,
      renewal_required: certData.renewalRequired,
      document_path: certData.documentPath,
      scope: certData.scope,
      accreditation_body: certData.accreditationBody,
      surveillance_date: certData.surveillanceDate || null,
      cost: certData.cost ? parseFloat(certData.cost) : null,
      validity_period: certData.validityPeriod,
      benefits: certData.benefits,
      maintenance_requirements: certData.maintenanceRequirements
    };

    const response = await certificationsAPI.create(dbCertData);
    if (response && response.success) {
      await loadCertificationsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error adding certification:', error);
    throw error;
  }
};

const updateCertification = async (certId, certData) => {
  try {
    console.log('✏️ Updating certification:', certId, certData);
    const dbCertData = {
      name: certData.name,
      issuing_authority: certData.issuingAuthority,
      certificate_number: certData.certificateNumber,
      issue_date: certData.issueDate,
      expiry_date: certData.expiryDate,
      status: certData.status,
      renewal_required: certData.renewalRequired,
      document_path: certData.documentPath,
      scope: certData.scope,
      accreditation_body: certData.accreditationBody,
      surveillance_date: certData.surveillanceDate || null,
      cost: certData.cost ? parseFloat(certData.cost) : null,
      validity_period: certData.validityPeriod,
      benefits: certData.benefits,
      maintenance_requirements: certData.maintenanceRequirements
    };

    const response = await certificationsAPI.update(certId, dbCertData);
    if (response && response.success) {
      await loadCertificationsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error updating certification:', error);
    throw error;
  }
};

const deleteCertification = async (certId) => {
  try {
    console.log('🗑️ Deleting certification:', certId);
    const response = await certificationsAPI.delete(certId);
    if (response && response.success) {
      await loadCertificationsFromDatabase();
    }
  } catch (error) {
    console.error('❌ Error deleting certification:', error);
    throw error;
  }
};
const loadAuditsFromDatabase = async () => {
    setAuditsLoading(true);
    try {
        console.log('🔄 Loading audits from database...');
        const response = await auditsAPI.getAll();
        console.log('📋 Audits response:', response);
        if (response && response.success && Array.isArray(response.data)) {
            // MAP BACKEND FIELDS TO FRONTEND EXPECTED FIELDS
            const formattedAudits = response.data.map(audit => ({
                id: audit.id,
                auditType: audit.audit_type,           
                auditor: audit.auditor,
                auditFirm: audit.audit_firm,           
                scheduledDate: audit.scheduled_date,   
                completedDate: audit.completed_date,   
                duration: audit.duration,
                status: audit.status,
                findings: audit.findings,
                correctiveActions: audit.corrective_actions,  
                score: audit.score,
                auditScope: audit.audit_scope,         
                auditCriteria: audit.audit_criteria,   
                nonConformities: audit.non_conformities,  
                recommendations: audit.recommendations,
                followUpDate: audit.follow_up_date,    
                cost: audit.cost,
                reportPath: audit.report_path          
            }));
            setAuditsFromDB(formattedAudits);
            setAudits(formattedAudits); 
        } else {
            setAuditsFromDB([]);
        }
    } catch (error) {
        console.error('❌ Error loading audits:', error);
        setAuditsFromDB([]);
    } finally {
        setAuditsLoading(false);
    }
};

const addAuditToDB = async (auditData) => {
    try {
        console.log('➕ Adding audit:', auditData);
        const dbAuditData = {
            id: auditData.id,
            audit_type: auditData.auditType,
            auditor: auditData.auditor,
            audit_firm: auditData.auditFirm,
            scheduled_date: auditData.scheduledDate,
            completed_date: auditData.completedDate || null,
            duration: auditData.duration ? parseInt(auditData.duration) : null,
            status: auditData.status,
            findings: auditData.findings,
            corrective_actions: auditData.correctiveActions,
            score: auditData.score ? parseInt(auditData.score) : null,
            audit_scope: auditData.auditScope,
            audit_criteria: auditData.auditCriteria,
            non_conformities: auditData.nonConformities,
            recommendations: auditData.recommendations,
            follow_up_date: auditData.followUpDate || null,
            cost: auditData.cost ? parseFloat(auditData.cost) : null,
            report_path: auditData.reportPath
        };

        const response = await auditsAPI.create(dbAuditData);
        if (response && response.success) {
            await loadAuditsFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error adding audit:', error);
        throw error;
    }
};

const updateAuditInDB = async (auditId, auditData) => {
    try {
        console.log('✏️ Updating audit:', auditId, auditData);
        const dbAuditData = {
            audit_type: auditData.auditType,
            auditor: auditData.auditor,
            audit_firm: auditData.auditFirm,
            scheduled_date: auditData.scheduledDate,
            completed_date: auditData.completedDate || null,
            duration: auditData.duration ? parseInt(auditData.duration) : null,
            status: auditData.status,
            findings: auditData.findings,
            corrective_actions: auditData.correctiveActions,
            score: auditData.score ? parseInt(auditData.score) : null,
            audit_scope: auditData.auditScope,
            audit_criteria: auditData.auditCriteria,
            non_conformities: auditData.nonConformities,
            recommendations: auditData.recommendations,
            follow_up_date: auditData.followUpDate || null,
            cost: auditData.cost ? parseFloat(auditData.cost) : null,
            report_path: auditData.reportPath
        };

        const response = await auditsAPI.update(auditId, dbAuditData);
        if (response && response.success) {
            await loadAuditsFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error updating audit:', error);
        throw error;
    }
};

const deleteAuditFromDB = async (auditId) => {
    try {
        console.log('🗑️ Deleting audit:', auditId);
        const response = await auditsAPI.delete(auditId);
        if (response && response.success) {
            await loadAuditsFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error deleting audit:', error);
        throw error;
    }
};

const loadDocumentsFromDatabase = async () => {
    setDocumentsLoading(true);
    try {
        console.log('🔄 Loading documents from database...');
        const response = await documentsAPI.getAll();
        console.log('📋 Documents response:', response);
        if (response && response.success && Array.isArray(response.data)) {
            // MAP BACKEND FIELDS TO FRONTEND EXPECTED FIELDS
            const formattedDocuments = response.data.map(doc => ({
                id: doc.id,
                name: doc.name,
                type: doc.type,
                category: doc.category,
                uploadDate: doc.upload_date,           
                expiryDate: doc.expiry_date,           
                status: doc.status,
                size: doc.size,
                version: doc.version,
                uploadedBy: doc.uploaded_by,           
                reviewedBy: doc.reviewed_by,           
                approvedBy: doc.approved_by,           
                filePath: doc.file_path,               
                description: doc.description
            }));
            setDocumentsFromDB(formattedDocuments);
        } else {
            setDocumentsFromDB([]);
        }
    } catch (error) {
        console.error('❌ Error loading documents:', error);
        setDocumentsFromDB([]);
    } finally {
        setDocumentsLoading(false);
    }
};


const addDocumentToDB = async (documentData) => {
    try {
        console.log('➕ Adding document:', documentData);
        const dbDocumentData = {
            id: documentData.id,
            name: documentData.name,
            type: documentData.type,
            category: documentData.category,
            upload_date: documentData.uploadDate,
            expiry_date: documentData.expiryDate || null,
            status: documentData.status,
            size: documentData.size,
            version: documentData.version,
            uploaded_by: documentData.uploadedBy,
            reviewed_by: documentData.reviewedBy,
            approved_by: documentData.approvedBy,
            file_path: documentData.filePath,
            description: documentData.description
        };

        const response = await documentsAPI.create(dbDocumentData);
        if (response && response.success) {
            await loadDocumentsFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error adding document:', error);
        throw error;
    }
};

const updateDocumentInDB = async (documentId, documentData) => {
    try {
        console.log('✏️ Updating document:', documentId, documentData);
        const dbDocumentData = {
            name: documentData.name,
            type: documentData.type,
            category: documentData.category,
            upload_date: documentData.uploadDate,
            expiry_date: documentData.expiryDate || null,
            status: documentData.status,
            size: documentData.size,
            version: documentData.version,
            uploaded_by: documentData.uploadedBy,
            reviewed_by: documentData.reviewedBy,
            approved_by: documentData.approvedBy,
            file_path: documentData.filePath,
            description: documentData.description
        };

        const response = await documentsAPI.update(documentId, dbDocumentData);
        if (response && response.success) {
            await loadDocumentsFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error updating document:', error);
        throw error;
    }
};

const deleteDocumentFromDB = async (documentId) => {
    try {
        console.log('🗑️ Deleting document:', documentId);
        const response = await documentsAPI.delete(documentId);
        if (response && response.success) {
            await loadDocumentsFromDatabase();
        }
    } catch (error) {
        console.error('❌ Error deleting document:', error);
        throw error;
    }
};


  const value = {
    farmers,
    setFarmers,
    suppliers,
    setSuppliers,
    milkEntries,
    setMilkEntries,
    addFarmer,
    updateFarmer,
    deleteFarmer,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addMilkEntry,
    updateMilkEntry,
    deleteMilkEntry,
    loading,
    error,
    fleetManagement,
    setFleetManagement,
    addFleetRecord,
    updateFleetRecord,
    deleteFleetRecord,
   // Inventory
    inventoryItems,
    setInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    // Quality Tests
    qualityTests,
    setQualityTests,
    generateQualityDistribution,
    // Processing Units
    processingUnits,
    setProcessingUnits,
    loadProcessingUnitsFromDatabase,
    addProcessingUnit,
    updateProcessingUnit,
    deleteProcessingUnit,
    productionBatches,
    setProductionBatches,
    // CRUD operations for production batches
    loadProductionBatchesFromDatabase,
    addProductionBatch,
    updateProductionBatch,
    deleteProductionBatch,
    qualityChecksData,
    setQualityChecksData,
    maintenanceRecordsData,
    setMaintenanceRecordsData,
    // Logistics
    vehicles,
    setVehicles,
    deliveries,
    setDeliveries,
    deliveriesLoading,
    loadDeliveriesFromDatabase,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    // Quality Control Records
    qualityControlRecords,
    setQualityControlRecords,
    qualityControlLoading,
    loadQualityControlRecordsFromDatabase,
    addQualityControlRecord,
    updateQualityControlRecord,
    deleteQualityControlRecord,
    // Maintenance Records
    maintenanceRecords,
    setMaintenanceRecords,
    maintenanceLoading,
    loadMaintenanceRecordsFromDatabase,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    // Database-connected Retailers & Sales
    retailersFromDB,
    setRetailersFromDB,
    retailersLoading,
    loadRetailersFromDatabase,
    addRetailerToDB,
    updateRetailerInDB,
    deleteRetailerFromDB,
    salesFromDB,
    setSalesFromDB,
    salesLoading,
    loadSalesFromDatabase,
    addSaleToDB,
    updateSaleInDB,
    deleteSaleFromDB,
    // Backend-connected Inventory Records
    inventoryRecords,
    setInventoryRecords,
    inventoryLoading,
    loadInventoryRecordsFromDatabase,
    addInventoryRecordToDB,
    updateInventoryRecordInDB,
    deleteInventoryRecordFromDB,
    // Sales & Retailers
    retailers,
    setRetailers,
    addRetailer,
    updateRetailer,
    deleteRetailer,
    sales,
    setSales,
    addSale,
    updateSale,
    deleteSale,
    employeesFromDB,
    setEmployeesFromDB,
    employeesLoading,
    loadEmployeesFromDatabase,
    addEmployeeToDB,
    updateEmployeeInDB,
    deleteEmployeeFromDB,
    // Workforce
    employees,
    setEmployees,
    // Reviews
    reviews,
    setReviews,
    // Metrics Data
    employeeData,
    setEmployeeData,
    updateEmployeeData,
    processingData,
    setProcessingData,
    updateProcessingData,
    // Backend-connected Payments & Bills
    paymentsFromDB,
    setPaymentsFromDB,
    paymentsLoading,
    loadPaymentsFromDatabase,
    addPaymentToDB,
    updatePaymentInDB,
    deletePaymentFromDB,
    billsFromDB,
    setBillsFromDB,
    billsLoading,
    loadBillsFromDatabase,
    addBillToDB,
    updateBillInDB,
    deleteBillFromDB,
    // Lab Quality Tests
    labQualityTests,
    labQualityTestsLoading,
    loadLabQualityTestsFromDatabase,
    addLabQualityTest,
    updateLabQualityTest,
    deleteLabQualityTest,
    generateQualityDistribution,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    loadReviewsFromDatabase,
    reviewsLoading,
    reviewsError,
    // Farmer Feedback
    farmerFeedback,
    setFarmerFeedback,
    farmerFeedbackLoading,
    farmerFeedbackError,
    loadFarmerFeedbackFromDatabase,
    addFarmerFeedback,
    updateFarmerFeedback,
    deleteFarmerFeedback,
    // Message operations - ADD THESE LINES
    messages,
    setMessages,
    messagesLoading,
    messagesError,
    loadMessagesFromDatabase,
    addMessage,
    updateMessage,
    deleteMessage,
    updateMessageStatus,
    announcements,
    announcementsLoading,
    announcementsError,
    loadAnnouncementsFromDatabase,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    groupMessages,
    groupMessagesLoading,
    groupMessagesError,
    loadGroupMessagesFromDatabase,
    addGroupMessage,
    updateGroupMessageInDB,
    deleteGroupMessageFromDB,
    complianceRecordsFromDB,
    certificationsFromDB,
    complianceRecordsLoading,
    certificationsLoading,
    addComplianceRecord,
    updateComplianceRecord,
    deleteComplianceRecord,
    addCertification,
    updateCertification,
    deleteCertification,
    // COMPLIANCE DATA
    auditsFromDB,
    auditsLoading,
    documentsFromDB,
    documentsLoading,
    addAuditToDB,
    updateAuditInDB,
    deleteAuditFromDB,
    addDocumentToDB,
    updateDocumentInDB,
    deleteDocumentFromDB,
    loadAuditsFromDatabase,
    loadDocumentsFromDatabase,
    complianceRecords,
    setComplianceRecords,
    certifications,
    setCertifications,
    audits,
    setAudits,
    // Network Growth Data
    generateNetworkGrowthData,
    // Calculated Metrics
    calculateSustainabilityIndex,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
