const Certification = require('../models/Certification');
const { validationResult } = require('express-validator');

const certificationController = {
  getAllCertifications: async (req, res) => {
    try {
      const certifications = await Certification.getAll();
      res.json({
        success: true,
        data: certifications,
        message: 'Certifications fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getCertificationById: async (req, res) => {
    try {
      const { id } = req.params;
      const certification = await Certification.getById(id);
      if (!certification) {
        return res.status(404).json({
          success: false,
          message: 'Certification not found'
        });
      }
      res.json({
        success: true,
        data: certification,
        message: 'Certification fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createCertification: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const certification = await Certification.create(req.body);
      res.status(201).json({
        success: true,
        data: certification,
        message: 'Certification created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateCertification: async (req, res) => {
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
      const certification = await Certification.update(id, req.body);
      res.json({
        success: true,
        data: certification,
        message: 'Certification updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteCertification: async (req, res) => {
    try {
      const { id } = req.params;
      await Certification.delete(id);
      res.json({
        success: true,
        message: 'Certification deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getCertificationStats: async (req, res) => {
    try {
      const stats = await Certification.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Certification statistics fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getExpiringCertifications: async (req, res) => {
    try {
      const { days } = req.params;
      const certifications = await Certification.getExpiring(parseInt(days) || 30);
      res.json({
        success: true,
        data: certifications,
        message: 'Expiring certifications fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = certificationController;
