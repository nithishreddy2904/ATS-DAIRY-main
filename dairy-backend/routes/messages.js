const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');

// Validation middleware
const messageValidation = [
  body('id').matches(/^MSG[0-9]{3}$/).withMessage('ID must be in format MSG001'),
  body('farmer_id').matches(/^[A-Za-z]+[0-9]{4}$/).withMessage('Invalid farmer ID format'),
  body('subject').isLength({ min: 1, max: 255 }).withMessage('Subject must be 1-255 characters'),
  body('message').isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters'),
  body('timestamp').isISO8601().withMessage('Invalid timestamp format'),
  body('status').isIn(['Sent', 'Delivered', 'Read', 'Failed']).withMessage('Invalid status'),
  body('priority').isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority')
];

const statusValidation = [
  body('status').isIn(['Sent', 'Delivered', 'Read', 'Failed']).withMessage('Invalid status')
];

// Routes
router.get('/', messageController.getAllMessages);
router.get('/stats', messageController.getMessageStats);
router.get('/:id', messageController.getMessageById);
router.get('/farmer/:farmerId', messageController.getMessagesByFarmerId);
router.post('/', messageValidation, messageController.createMessage);
router.put('/:id', messageValidation, messageController.updateMessage);
router.patch('/:id/status', statusValidation, messageController.updateMessageStatus);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
