const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const certificationController = require('../controllers/certificationController');

// Validation middleware
const certificationValidation = [
  body('id').matches(/^CERT[0-9]{3}$/).withMessage('ID must be in format CERT001'),
  body('name').isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  body('issuing_authority').isLength({ min: 2, max: 200 }).withMessage('Issuing authority must be 2-200 characters'),
  body('certificate_number').matches(/^[A-Z]{3}[0-9]{6}$/).withMessage('Certificate number must be in format ABC123456'),
  body('issue_date').isISO8601().withMessage('Invalid issue date format'),
  body('expiry_date').isISO8601().withMessage('Invalid expiry date format'),
  body('status').isIn(['Active', 'Expired', 'Pending Renewal', 'Under Process', 'Suspended', 'Cancelled']).withMessage('Invalid status'),
  body('renewal_required').isBoolean().withMessage('Renewal required must be boolean'),
  body('document_path').optional().isLength({ max: 500 }).withMessage('Document path must be max 500 characters'),
  body('scope').optional().isLength({ max: 1000 }).withMessage('Scope must be max 1000 characters'),
  body('accreditation_body').optional().isLength({ max: 200 }).withMessage('Accreditation body must be max 200 characters'),
  body('surveillance_date').optional().isISO8601().withMessage('Invalid surveillance date format'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('validity_period').optional().isLength({ max: 50 }).withMessage('Validity period must be max 50 characters'),
  body('benefits').optional().isLength({ max: 1000 }).withMessage('Benefits must be max 1000 characters'),
  body('maintenance_requirements').optional().isLength({ max: 1000 }).withMessage('Maintenance requirements must be max 1000 characters')
];

// Routes
router.get('/', certificationController.getAllCertifications);
router.get('/stats', certificationController.getCertificationStats);
router.get('/expiring/:days', certificationController.getExpiringCertifications);
router.get('/:id', certificationController.getCertificationById);
router.post('/', certificationValidation, certificationController.createCertification);
router.put('/:id', certificationValidation, certificationController.updateCertification);
router.delete('/:id', certificationController.deleteCertification);

module.exports = router;
