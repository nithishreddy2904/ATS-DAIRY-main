const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const milkEntryController = require('../controllers/milkEntryController');

// Validation middleware
const milkEntryValidation = [
  body('farmer_id').matches(/^FARM[0-9]{4}$/).withMessage('Farmer ID must be in format FARM0001'),
  body('farmer_name').isLength({ min: 2, max: 100 }).withMessage('Farmer name must be 2-100 characters'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('quantity').isFloat({ min: 0.1, max: 1000 }).withMessage('Quantity must be between 0.1 and 1000'),
  body('shift').isIn(['Morning', 'Evening']).withMessage('Shift must be Morning or Evening'),
  body('quality').isIn(['A+', 'A', 'B', 'C', 'D']).withMessage('Quality must be A+, A, B, C, or D'),
  body('fat_content').optional().isFloat({ min: 0, max: 10 }).withMessage('Fat content must be between 0 and 10'),
  body('snf_content').optional().isFloat({ min: 0, max: 15 }).withMessage('SNF content must be between 0 and 15'),
  body('temperature').optional().isFloat({ min: 0, max: 50 }).withMessage('Temperature must be between 0 and 50'),
  body('ph_level').optional().isFloat({ min: 6, max: 8 }).withMessage('pH level must be between 6 and 8'),
  body('collection_center').optional().isLength({ max: 100 }).withMessage('Collection center name too long'),
  body('collected_by').optional().isLength({ max: 100 }).withMessage('Collector name too long'),
  body('vehicle_number').optional().isLength({ max: 20 }).withMessage('Vehicle number too long'),
  body('payment_amount').optional().isFloat({ min: 0 }).withMessage('Payment amount must be positive'),
  body('payment_status').optional().isIn(['Pending', 'Paid', 'Partial']).withMessage('Invalid payment status')
];

// Routes
router.get('/', milkEntryController.getAllMilkEntries);
router.get('/stats', milkEntryController.getMilkEntryStats);
router.get('/farmer/:farmerId', milkEntryController.getMilkEntriesByFarmer);
router.get('/date-range', milkEntryController.getMilkEntriesByDateRange);
router.get('/:id', milkEntryController.getMilkEntryById);
router.post('/', milkEntryValidation, milkEntryController.createMilkEntry);
router.put('/:id', milkEntryValidation, milkEntryController.updateMilkEntry);
router.delete('/:id', milkEntryController.deleteMilkEntry);

module.exports = router;
