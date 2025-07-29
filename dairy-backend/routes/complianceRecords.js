const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const complianceRecordController = require('../controllers/complianceRecordController');

// Validation middleware
const complianceRecordValidation = [
  body('id').matches(/^COMP[0-9]{3}$/).withMessage('ID must be in format COMP001'),
  body('type').isLength({ min: 2, max: 100 }).withMessage('Type must be 2-100 characters'),
  body('title').isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('status').isIn(['Compliant', 'Non-Compliant', 'Pending', 'Under Review', 'Expired', 'Renewed']).withMessage('Invalid status'),
  body('priority').isIn(['High', 'Medium', 'Low', 'Critical']).withMessage('Invalid priority'),
  body('due_date').isISO8601().withMessage('Invalid due date format'),
  body('completed_date').optional().isISO8601().withMessage('Invalid completed date format'),
  body('assigned_to').isLength({ min: 2, max: 100 }).withMessage('Assigned to must be 2-100 characters'),
  body('responsible_department').isLength({ min: 2, max: 100 }).withMessage('Department must be 2-100 characters'),
  body('compliance_officer').optional().isLength({ max: 100 }).withMessage('Compliance officer must be max 100 characters'),
  body('regulatory_body').optional().isLength({ max: 100 }).withMessage('Regulatory body must be max 100 characters'),
  body('license_number').optional().isLength({ max: 50 }).withMessage('License number must be max 50 characters'),
  body('validity_period').optional().isLength({ max: 50 }).withMessage('Validity period must be max 50 characters'),
  body('renewal_date').optional().isISO8601().withMessage('Invalid renewal date format'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('remarks').optional().isLength({ max: 1000 }).withMessage('Remarks must be max 1000 characters'),
  body('risk_level').isIn(['High', 'Medium', 'Low', 'Critical']).withMessage('Invalid risk level'),
  body('business_impact').isIn(['High', 'Medium', 'Low']).withMessage('Invalid business impact')
];

// Routes
router.get('/', complianceRecordController.getAllComplianceRecords);
router.get('/stats', complianceRecordController.getComplianceStats);
router.get('/:id', complianceRecordController.getComplianceRecordById);
router.post('/', complianceRecordValidation, complianceRecordController.createComplianceRecord);
router.put('/:id', complianceRecordValidation, complianceRecordController.updateComplianceRecord);
router.delete('/:id', complianceRecordController.deleteComplianceRecord);

module.exports = router;
