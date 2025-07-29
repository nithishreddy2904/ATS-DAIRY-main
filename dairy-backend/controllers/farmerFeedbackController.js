const FarmerFeedback = require('../models/FarmerFeedback');
const { validationResult } = require('express-validator');

const farmerFeedbackController = {
    getAllFeedback: async (req, res) => {
        try {
            const feedback = await FarmerFeedback.getAll();
            res.json({
                success: true,
                data: feedback,
                message: 'Farmer feedback fetched successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    createFeedback: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const feedback = await FarmerFeedback.create(req.body);
            res.status(201).json({
                success: true,
                data: feedback,
                message: 'Farmer feedback created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    updateFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            const feedback = await FarmerFeedback.update(id, req.body);
            res.json({
                success: true,
                data: feedback,
                message: 'Farmer feedback updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            await FarmerFeedback.delete(id);
            res.json({
                success: true,
                message: 'Farmer feedback deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = farmerFeedbackController;
