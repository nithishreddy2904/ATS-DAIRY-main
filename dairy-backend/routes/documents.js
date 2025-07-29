const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const documentController = require('../controllers/documentController');

// Validation middleware for documents
const documentValidation = [
    body('id').matches(/^DOC[0-9]{3}$/).withMessage('ID must be in format DOC001'),
    body('name').isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),
    body('type').isIn(['License', 'Certificate', 'Report', 'Policy', 'Procedure', 'Record', 'Manual']).withMessage('Invalid document type'),
    body('category').isIn(['Quality Control', 'Environmental', 'Safety', 'Financial', 'Legal', 'Operational', 'Regulatory', 'Training', 'Emergency']).withMessage('Invalid category'),
    body('upload_date').isISO8601().withMessage('Invalid upload date format'),
    body('expiry_date').optional().isISO8601().withMessage('Invalid expiry date format'),
    body('status').isIn(['Active', 'Expired', 'Under Review']).withMessage('Invalid status'),
    body('size').optional().isLength({ max: 50 }).withMessage('Size must not exceed 50 characters'),
    body('version').optional().isLength({ max: 20 }).withMessage('Version must not exceed 20 characters'),
    body('uploaded_by').isLength({ min: 2, max: 100 }).withMessage('Uploaded by must be 2-100 characters'),
    body('reviewed_by').optional().isLength({ min: 2, max: 100 }).withMessage('Reviewed by must be 2-100 characters'),
    body('approved_by').optional().isLength({ min: 2, max: 100 }).withMessage('Approved by must be 2-100 characters'),
    body('file_path').optional().isLength({ max: 500 }).withMessage('File path must not exceed 500 characters'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters')
];

// Routes
router.get('/', documentController.getAllDocuments);
router.get('/:id', documentController.getDocumentById);
router.post('/', documentValidation, documentController.createDocument);
router.put('/:id', documentValidation, documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
