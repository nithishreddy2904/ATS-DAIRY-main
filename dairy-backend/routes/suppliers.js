const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supplierController = require('../controllers/supplierController');

// Validation middleware
const supplierValidation = [
  body('id').matches(/^SUP[0-9]{3}$/).withMessage('ID must be in format SUP001'),
  body('company_name').isLength({ min: 2, max: 150 }).withMessage('Company name must be 2-150 characters'),
  body('contact_person').isLength({ min: 2, max: 100 }).withMessage('Contact person must be 2-100 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Phone must be valid 10-digit number'),
  body('email').isEmail().withMessage('Must be valid email'),
  body('address').isLength({ min: 10, max: 500 }).withMessage('Address must be 10-500 characters'),
  body('supplier_type').isIn(['Feed Supplier', 'Equipment Supplier', 'Packaging Supplier', 'Chemical Supplier', 'Testing Services', 'Logistics']).withMessage('Invalid supplier type'),
  body('status').isIn(['Active', 'Inactive', 'Pending Approval']).withMessage('Invalid status'),
  body('join_date').isISO8601().withMessage('Invalid date format')
];

// Routes
router.get('/', supplierController.getAllSuppliers);
router.get('/stats', supplierController.getSupplierStats);
router.get('/:id', supplierController.getSupplierById);
router.post('/', supplierValidation, supplierController.createSupplier);
router.put('/:id', supplierValidation, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
