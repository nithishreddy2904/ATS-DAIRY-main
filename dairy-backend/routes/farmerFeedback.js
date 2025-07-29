const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const farmerFeedbackController = require('../controllers/farmerFeedbackController');

// Validation middleware
const farmerFeedbackValidation = [
    body('id').matches(/^FB[0-9]{3}$/).withMessage('ID must be in format FB001'),
    body('farmer_name').isLength({ min: 2, max: 100 }).withMessage('Farmer name must be 2-100 characters'),
    body('farmer_id').matches(/^FARM[0-9]{4}$/).withMessage('Farmer ID must be in format FARM0001'),
    body('feedback_type').isIn(['Complaint', 'Suggestion', 'Compliment', 'Quality Issue', 'Service Request']).withMessage('Invalid feedback type'),
    body('rating').isInt({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('message').isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('priority').isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority level'),
    body('status').isIn(['Open', 'In Review', 'Resolved', 'Closed']).withMessage('Invalid status')
];

// Routes
router.get('/', farmerFeedbackController.getAllFeedback);
router.post('/', farmerFeedbackValidation, farmerFeedbackController.createFeedback);
router.put('/:id', farmerFeedbackValidation, farmerFeedbackController.updateFeedback);
router.delete('/:id', farmerFeedbackController.deleteFeedback);

module.exports = router;
