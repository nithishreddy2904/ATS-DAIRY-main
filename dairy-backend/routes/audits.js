const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auditController = require('../controllers/auditController');

// Validation middleware for audits
const auditValidation = [
    body('id').matches(/^AUD[0-9]{3}$/).withMessage('ID must be in format AUD001'),
    body('audit_type').isIn(['Internal Audit', 'External Audit', 'Regulatory Inspection', 'Customer Audit', 'Supplier Audit', 'Environmental Audit', 'Safety Audit', 'Quality Audit']).withMessage('Invalid audit type'),
    body('auditor').isLength({ min: 2, max: 100 }).withMessage('Auditor name must be 2-100 characters'),
    body('audit_firm').optional().isLength({ min: 2, max: 100 }).withMessage('Audit firm must be 2-100 characters'),
    body('scheduled_date').isISO8601().withMessage('Invalid scheduled date format'),
    body('completed_date').optional().isISO8601().withMessage('Invalid completed date format'),
    body('duration').optional().isInt({ min: 0, max: 365 }).withMessage('Duration must be 0-365 days'),
    body('status').isIn(['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled']).withMessage('Invalid status'),
    body('findings').optional().isLength({ max: 1000 }).withMessage('Findings must not exceed 1000 characters'),
    body('corrective_actions').optional().isLength({ max: 1000 }).withMessage('Corrective actions must not exceed 1000 characters'),
    body('score').optional().isInt({ min: 0, max: 100 }).withMessage('Score must be between 0-100'),
    body('audit_scope').optional().isLength({ max: 500 }).withMessage('Audit scope must not exceed 500 characters'),
    body('audit_criteria').optional().isLength({ max: 500 }).withMessage('Audit criteria must not exceed 500 characters'),
    body('non_conformities').optional().isLength({ max: 1000 }).withMessage('Non-conformities must not exceed 1000 characters'),
    body('recommendations').optional().isLength({ max: 1000 }).withMessage('Recommendations must not exceed 1000 characters'),
    body('follow_up_date').optional().isISO8601().withMessage('Invalid follow-up date format'),
    body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    body('report_path').optional().isLength({ max: 255 }).withMessage('Report path must not exceed 255 characters')
];

// Routes
router.get('/', auditController.getAllAudits);
router.get('/:id', auditController.getAuditById);
router.post('/', auditValidation, auditController.createAudit);
router.put('/:id', auditValidation, auditController.updateAudit);
router.delete('/:id', auditController.deleteAudit);

module.exports = router;
