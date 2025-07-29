const Document = require('../models/Document');
const { validationResult } = require('express-validator');

const documentController = {
    getAllDocuments: async (req, res) => {
        try {
            const documents = await Document.getAll();
            res.json({
                success: true,
                data: documents,
                message: 'Documents fetched successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getDocumentById: async (req, res) => {
        try {
            const { id } = req.params;
            const document = await Document.getById(id);
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: 'Document not found'
                });
            }
            res.json({
                success: true,
                data: document,
                message: 'Document fetched successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    createDocument: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const document = await Document.create(req.body);
            res.status(201).json({
                success: true,
                data: document,
                message: 'Document created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    updateDocument: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const document = await Document.update(id, req.body);
            res.json({
                success: true,
                data: document,
                message: 'Document updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteDocument: async (req, res) => {
        try {
            const { id } = req.params;
            await Document.delete(id);
            res.json({
                success: true,
                message: 'Document deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = documentController;
