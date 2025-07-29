const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const groupMessageController = require('../controllers/groupMessageController');

// Validation middleware
const groupMessageValidation = [
  body('group_name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Group name must be 2-100 characters')
    .matches(/^[A-Za-z0-9\s&.-]+$/)
    .withMessage('Group name contains invalid characters'),
  
  body('message')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be 1-1000 characters'),
  
  body('sender_name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Sender name must be 2-100 characters')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Sender name should contain only letters and spaces'),
  
  body('member_count')
    .isInt({ min: 0, max: 1000 })
    .withMessage('Member count must be between 0 and 1000'),
  
  body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Invalid timestamp format')
];

// Routes
router.get('/', groupMessageController.getAllGroupMessages);
router.get('/stats', groupMessageController.getGroupMessageStats);
router.get('/group/:groupName', groupMessageController.getGroupMessagesByGroupName);
router.get('/:id', groupMessageController.getGroupMessageById);
router.post('/', groupMessageValidation, groupMessageController.createGroupMessage);
router.put('/:id', groupMessageValidation, groupMessageController.updateGroupMessage);
router.delete('/:id', groupMessageController.deleteGroupMessage);

module.exports = router;
