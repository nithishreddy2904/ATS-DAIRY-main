const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const farmerController = require('../controllers/farmerController');

// Validation middleware
const farmerValidation = [
  body('id').matches(/^FARM[0-9]{4}$/).withMessage('ID must be in format FARM0001'),
  body('name').isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Phone must be valid 10-digit number'),
  body('email').isEmail().withMessage('Must be valid email'),
  body('address').isLength({ min: 10, max: 500 }).withMessage('Address must be 10-500 characters'),
  body('cattle_count').isInt({ min: 1, max: 1000 }).withMessage('Cattle count must be 1-1000'),
  body('bank_account').matches(/^[0-9]{9,18}$/).withMessage('Bank account must be 9-18 digits'),
  body('ifsc_code').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),
  body('status').isIn(['Active', 'Inactive', 'Suspended']).withMessage('Invalid status'),
  body('join_date').isISO8601().withMessage('Invalid date format')
];

// Routes
router.get('/', farmerController.getAllFarmers);
router.post('/', farmerValidation, farmerController.createFarmer);
router.put('/:id', farmerValidation, farmerController.updateFarmer);
router.delete('/:id', farmerController.deleteFarmer);

module.exports = router;
