const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');

// Validation middleware
const reviewValidation = [
  body('id').matches(/^REV[0-9]{3}$/).withMessage('ID must be in format REV001'),
  body('customer_name').isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('customer_email').isEmail().withMessage('Must be valid email'),
  body('category').notEmpty().withMessage('Category is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('subject').isLength({ min: 3, max: 200 }).withMessage('Subject must be 3-200 characters'),
  body('comment').isLength({ min: 5, max: 1000 }).withMessage('Comment must be 5-1000 characters'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('status').isIn(['New', 'In Progress', 'Responded', 'Resolved', 'Escalated']).withMessage('Invalid status'),
  body('response').optional().isString(),
  body('response_date').optional().isISO8601().withMessage('Invalid response date format'),
];

// Routes
router.get('/', reviewController.getAllReviews);
router.post('/', reviewValidation, reviewController.createReview);
router.put('/:id', reviewValidation, reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
