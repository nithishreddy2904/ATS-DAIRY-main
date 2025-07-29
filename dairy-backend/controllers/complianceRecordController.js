const ComplianceRecord = require('../models/ComplianceRecord');
const { validationResult } = require('express-validator');

const complianceRecordController = {
  getAllComplianceRecords: async (req, res) => {
    try {
      const records = await ComplianceRecord.getAll();
      res.json({
        success: true,
        data: records,
        message: 'Compliance records fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getComplianceRecordById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await ComplianceRecord.getById(id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Compliance record not found'
        });
      }
      res.json({
        success: true,
        data: record,
        message: 'Compliance record fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createComplianceRecord: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const record = await ComplianceRecord.create(req.body);
      res.status(201).json({
        success: true,
        data: record,
        message: 'Compliance record created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateComplianceRecord: async (req, res) => {
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
      const record = await ComplianceRecord.update(id, req.body);
      res.json({
        success: true,
        data: record,
        message: 'Compliance record updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteComplianceRecord: async (req, res) => {
    try {
      const { id } = req.params;
      await ComplianceRecord.delete(id);
      res.json({
        success: true,
        message: 'Compliance record deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getComplianceStats: async (req, res) => {
    try {
      const stats = await ComplianceRecord.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Compliance statistics fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = complianceRecordController;
