const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const fleetController = require('../controllers/fleetController');

// Validation middleware
const fleetValidation = [
  body('id').matches(/^FLEET[0-9]{4}$/).withMessage('ID must be in format FLEET0001'),
  body('vehicle_number').isLength({ min: 1, max: 20 }).withMessage('Vehicle number is required'),
  body('vehicle_type').isLength({ min: 2, max: 50 }).withMessage('Vehicle type is required'),
  body('driver_name').isLength({ min: 2, max: 100 }).withMessage('Driver name is required'),
  body('driver_phone').matches(/^[6-9]\d{9}$/).withMessage('Driver phone must be valid 10-digit number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('status').isIn(['Available', 'In Use', 'Under Maintenance', 'Out of Service']).withMessage('Invalid status'),
  body('last_maintenance_date').optional().isISO8601().withMessage('Invalid date format'),
  body('next_maintenance_date').optional().isISO8601().withMessage('Invalid date format'),
  body('location').optional().isLength({ max: 100 }).withMessage('Location too long')
];

// Routes
router.get('/', fleetController.getAllFleet);
router.get('/stats', fleetController.getFleetStats);
router.get('/:id', fleetController.getFleetById);
router.post('/', fleetValidation, fleetController.createFleet);
router.put('/:id', fleetValidation, fleetController.updateFleet);
router.delete('/:id', fleetController.deleteFleet);

module.exports = router;
