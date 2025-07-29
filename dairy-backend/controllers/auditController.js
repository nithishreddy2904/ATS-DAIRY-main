const Audit = require('../models/Audit');
const { validationResult } = require('express-validator');

const auditController = {
    getAllAudits: async (req, res) => {
        try {
            const audits = await Audit.getAll();
            res.json({
                success: true,
                data: audits,
                message: 'Audits fetched successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAuditById: async (req, res) => {
        try {
            const { id } = req.params;
            const audit = await Audit.getById(id);
            if (!audit) {
                return res.status(404).json({
                    success: false,
                    message: 'Audit not found'
                });
            }
            res.json({
                success: true,
                data: audit,
                message: 'Audit fetched successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    createAudit: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const audit = await Audit.create(req.body);
            res.status(201).json({
                success: true,
                data: audit,
                message: 'Audit created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    updateAudit: async (req, res) => {
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
            const audit = await Audit.update(id, req.body);
            res.json({
                success: true,
                data: audit,
                message: 'Audit updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteAudit: async (req, res) => {
        try {
            const { id } = req.params;
            await Audit.delete(id);
            res.json({
                success: true,
                message: 'Audit deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = auditController;
