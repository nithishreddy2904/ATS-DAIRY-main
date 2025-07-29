CREATE DATABASE IF NOT EXISTS dairy_management;
USE dairy_management;

CREATE TABLE farmers (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  cattle_count INT NOT NULL,
  bank_account VARCHAR(20) NOT NULL,
  ifsc_code VARCHAR(15) NOT NULL,
  status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  join_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

USE dairy_management;

CREATE TABLE suppliers (
  id VARCHAR(20) PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  supplier_type ENUM('Feed Supplier', 'Equipment Supplier', 'Packaging Supplier', 'Chemical Supplier', 'Testing Services', 'Logistics') NOT NULL,
  status ENUM('Active', 'Inactive', 'Pending Approval') DEFAULT 'Active',
  join_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

 USE dairy_management;

CREATE TABLE milk_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id VARCHAR(20) NOT NULL,
  farmer_name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  shift ENUM('Morning', 'Evening') NOT NULL,
  quality ENUM('A+', 'A', 'B', 'C', 'D') NOT NULL,
  fat_content DECIMAL(5,2),
  snf_content DECIMAL(5,2),
  temperature DECIMAL(4,1),
  ph_level DECIMAL(3,1),
  collection_center VARCHAR(100),
  collected_by VARCHAR(100),
  vehicle_number VARCHAR(20),
  remarks TEXT,
  payment_amount DECIMAL(10,2),
  payment_status ENUM('Pending', 'Paid', 'Partial') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  INDEX idx_farmer_date (farmer_id, date),
  INDEX idx_date (date),
  INDEX idx_shift (shift)
);
USE dairy_management;

CREATE TABLE fleet_management (
  id VARCHAR(20) PRIMARY KEY,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  driver_name VARCHAR(100) NOT NULL,
  driver_phone VARCHAR(15) NOT NULL,
  capacity INT NOT NULL,
  status ENUM('Available', 'In Use', 'Under Maintenance', 'Out of Service') DEFAULT 'Available',
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  delivery_date DATE NOT NULL,
  vehicle_id VARCHAR(20),
  driver_name VARCHAR(100),
  destination VARCHAR(255) NOT NULL,
  status ENUM('pending', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES fleet_management(id)
);
CREATE TABLE quality_control_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(20) NOT NULL,
  unit_id VARCHAR(20) NOT NULL,
  test_date DATE NOT NULL,
  fat DECIMAL(5,2),
  protein DECIMAL(5,2),
  moisture DECIMAL(5,2),
  ph DECIMAL(5,2),
  result ENUM('Pass', 'Fail', 'Pending') DEFAULT 'Pending',
  inspector VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE maintenance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unit_id VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  type ENUM('Preventive', 'Corrective', 'Emergency', 'Scheduled') DEFAULT 'Preventive',
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  technician VARCHAR(100) NOT NULL,
  status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Retailers table
CREATE TABLE retailers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  location VARCHAR(100) NOT NULL,
  contact VARCHAR(15) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  retailer VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_retailer (retailer),
  INDEX idx_date (date)
);
ALTER TABLE retailers 
ADD COLUMN total_sales DECIMAL(10,2) DEFAULT 0.00 AFTER contact;

-- Create inventory records table with all required fields
CREATE TABLE inventory_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_code VARCHAR(20) NOT NULL UNIQUE,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  current_stock_level DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  minimum_stock_level DECIMAL(10,2) NOT NULL,    -- Minimum stock level
  maximum_stock_level DECIMAL(10,2) NOT NULL,    -- Maximum stock level
  location VARCHAR(100),
  status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
  last_updated DATE,
  supplier VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  join_date DATE NOT NULL,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  address TEXT,
  emergency_contact VARCHAR(15),
  experience INT,
  qualification VARCHAR(100),
  blood_group VARCHAR(5),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 -- Payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id VARCHAR(20) NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_mode ENUM('Bank Transfer', 'Cash', 'Check', 'UPI', 'Digital Wallet') NOT NULL,
  remarks TEXT,
  status ENUM('Completed', 'Pending', 'Failed', 'Processing') DEFAULT 'Pending',
  transaction_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bills table
CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id VARCHAR(20) NOT NULL UNIQUE,
  farmer_id VARCHAR(20) NOT NULL,
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status ENUM('Paid', 'Unpaid', 'Overdue', 'Partially Paid') DEFAULT 'Unpaid',
  category ENUM('Milk Purchase', 'Equipment', 'Maintenance', 'Transport', 'Utilities', 'Other') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE lab_quality_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(32) NOT NULL,
  sample_id VARCHAR(32) NOT NULL,
  farmer_id VARCHAR(32) NOT NULL,
  test_date DATE NOT NULL,
  test_type VARCHAR(32) NOT NULL,
  fat_content DECIMAL(4,2),
  protein_content DECIMAL(4,2),
  lactose_content DECIMAL(4,2),
  snf_content DECIMAL(4,2),
  ph_level DECIMAL(4,2),
  bacteria_count INT,
  adulteration VARCHAR(32),
  overall_grade VARCHAR(8),
  status VARCHAR(16),
  remarks TEXT,
  tested_by VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id VARCHAR(10) PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  rating INT NOT NULL,
  subject VARCHAR(200) NOT NULL,
  comment TEXT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  response TEXT,
  response_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE farmer_feedback (
    id VARCHAR(10) PRIMARY KEY,
    farmer_name VARCHAR(100) NOT NULL,
    farmer_id VARCHAR(10) NOT NULL,
    feedback_type ENUM('Complaint', 'Suggestion', 'Compliment', 'Quality Issue', 'Service Request') NOT NULL,
    rating INT CHECK (rating >= 0 AND rating <= 5),
    message TEXT NOT NULL,
    date DATE NOT NULL,
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    status ENUM('Open', 'In Review', 'Resolved', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_status (status),
    INDEX idx_date (date)
);
CREATE TABLE messages (
  id VARCHAR(10) PRIMARY KEY,
  farmer_id VARCHAR(10) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME NOT NULL,
  status ENUM('Sent', 'Delivered', 'Read', 'Failed') DEFAULT 'Sent',
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);
CREATE TABLE announcements (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(50) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    publish_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL,
    views INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE group_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    member_count INT NOT NULL DEFAULT 0,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_group_name (group_name),
    INDEX idx_timestamp (timestamp),
    INDEX idx_sender_name (sender_name)
);
CREATE TABLE compliance_records (
    id VARCHAR(10) PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Compliant', 'Non-Compliant', 'Pending', 'Under Review', 'Expired', 'Renewed') DEFAULT 'Pending',
    priority ENUM('High', 'Medium', 'Low', 'Critical') DEFAULT 'Medium',
    due_date DATE NOT NULL,
    completed_date DATE,
    assigned_to VARCHAR(100) NOT NULL,
    responsible_department VARCHAR(100) NOT NULL,
    compliance_officer VARCHAR(100),
    regulatory_body VARCHAR(100),
    license_number VARCHAR(50),
    validity_period VARCHAR(50),
    renewal_date DATE,
    cost DECIMAL(10,2),
    remarks TEXT,
    risk_level ENUM('High', 'Medium', 'Low', 'Critical') DEFAULT 'Medium',
    business_impact ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE certifications (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    issuing_authority VARCHAR(200) NOT NULL,
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('Active', 'Expired', 'Pending Renewal', 'Under Process', 'Suspended', 'Cancelled') DEFAULT 'Active',
    renewal_required BOOLEAN DEFAULT FALSE,
    document_path VARCHAR(500),
    scope TEXT,
    accreditation_body VARCHAR(200),
    surveillance_date DATE,
    cost DECIMAL(10,2),
    validity_period VARCHAR(50),
    benefits TEXT,
    maintenance_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Create audits table
CREATE TABLE audits (
    id VARCHAR(10) PRIMARY KEY,
    audit_type VARCHAR(100) NOT NULL,
    auditor VARCHAR(100) NOT NULL,
    audit_firm VARCHAR(100),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    duration INT,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled') DEFAULT 'Scheduled',
    findings TEXT,
    corrective_actions TEXT,
    score INT CHECK (score >= 0 AND score <= 100),
    audit_scope VARCHAR(500),
    audit_criteria VARCHAR(500),
    non_conformities TEXT,
    recommendations TEXT,
    follow_up_date DATE,
    cost DECIMAL(10,2),
    report_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE documents (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('License', 'Certificate', 'Report', 'Policy', 'Procedure', 'Record', 'Manual') NOT NULL,
    category ENUM('Quality Control', 'Environmental', 'Safety', 'Financial', 'Legal', 'Operational', 'Regulatory', 'Training', 'Emergency') NOT NULL,
    upload_date DATE NOT NULL,
    expiry_date DATE,
    status ENUM('Active', 'Expired', 'Under Review') DEFAULT 'Active',
    size VARCHAR(50),
    version VARCHAR(20) DEFAULT '1.0',
    uploaded_by VARCHAR(100) NOT NULL,
    reviewed_by VARCHAR(100),
    approved_by VARCHAR(100),
    file_path VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id            VARCHAR(20) PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash CHAR(60) NOT NULL,
  role          ENUM('admin','staff','farmer','supplier') DEFAULT 'staff',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id     VARCHAR(20) NOT NULL,
  token       CHAR(128) NOT NULL,
  expires_at  DATETIME NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
