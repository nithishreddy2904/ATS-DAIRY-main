const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const announcementController = require('../controllers/announcementController');

// Validation middleware similar to 'farmers'
const announcementValidation = [
    body('id').matches(/^ANN[0-9]{3}$/).withMessage('ID must be in format ANN001'),
    body('title').isLength({ min: 2, max: 150 }).withMessage('Title 2-150 chars'),
    body('content').isLength({ min: 5 }).withMessage('Content required'),
    body('target_audience').isLength({ min: 2, max: 50 }).withMessage('Target Audience required'),
    body('priority').isIn(['High', 'Medium', 'Low']).withMessage('Priority invalid'),
    body('publish_date').isISO8601().withMessage('Invalid date'),
    body('status').isIn(['Published', 'Draft', 'Archived']).withMessage('Invalid status'),
    body('views').optional().isInt({ min: 0 }).withMessage('Views must be >= 0')
];

// Routes
router.get('/', announcementController.getAllAnnouncements);
router.post('/', announcementValidation, announcementController.createAnnouncement);
router.put('/:id', announcementValidation, announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
