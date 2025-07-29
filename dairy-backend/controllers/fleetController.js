const FleetManagement = require('../models/FleetManagement');
const { validationResult } = require('express-validator');

const fleetController = {
  // Get all fleet records
  getAllFleet: async (req, res) => {
    try {
      const fleet = await FleetManagement.getAll();
      res.json({
        success: true,
        data: fleet,
        message: 'Fleet data fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get fleet record by ID
  getFleetById: async (req, res) => {
    try {
      const { id } = req.params;
      const fleet = await FleetManagement.getById(id);
      
      if (!fleet) {
        return res.status(404).json({
          success: false,
          message: 'Fleet record not found'
        });
      }

      res.json({
        success: true,
        data: fleet,
        message: 'Fleet record fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create new fleet record
  createFleet: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const fleet = await FleetManagement.create(req.body);
      res.status(201).json({
        success: true,
        data: fleet,
        message: 'Fleet record created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update fleet record
  updateFleet: async (req, res) => {
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
      const fleet = await FleetManagement.update(id, req.body);
      res.json({
        success: true,
        data: fleet,
        message: 'Fleet record updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete fleet record
  deleteFleet: async (req, res) => {
    try {
      const { id } = req.params;
      await FleetManagement.delete(id);
      res.json({
        success: true,
        message: 'Fleet record deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get fleet statistics
  getFleetStats: async (req, res) => {
    try {
      const stats = await FleetManagement.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Fleet statistics fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = fleetController;
