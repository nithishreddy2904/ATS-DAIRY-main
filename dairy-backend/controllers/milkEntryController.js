const MilkEntry = require('../models/MilkEntry');
const { validationResult } = require('express-validator');

const milkEntryController = {
  // Get all milk entries
  getAllMilkEntries: async (req, res) => {
    try {
      const milkEntries = await MilkEntry.getAll();
      res.json({
        success: true,
        data: milkEntries,
        message: 'Milk entries fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get milk entry by ID
  getMilkEntryById: async (req, res) => {
    try {
      const { id } = req.params;
      const milkEntry = await MilkEntry.getById(id);
      
      if (!milkEntry) {
        return res.status(404).json({
          success: false,
          message: 'Milk entry not found'
        });
      }

      res.json({
        success: true,
        data: milkEntry,
        message: 'Milk entry fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create new milk entry
  createMilkEntry: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const milkEntry = await MilkEntry.create(req.body);
      res.status(201).json({
        success: true,
        data: milkEntry,
        message: 'Milk entry created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update milk entry
  updateMilkEntry: async (req, res) => {
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
      const milkEntry = await MilkEntry.update(id, req.body);
      
      res.json({
        success: true,
        data: milkEntry,
        message: 'Milk entry updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete milk entry
  deleteMilkEntry: async (req, res) => {
    try {
      const { id } = req.params;
      await MilkEntry.delete(id);
      
      res.json({
        success: true,
        message: 'Milk entry deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get milk entry statistics
  getMilkEntryStats: async (req, res) => {
    try {
      const stats = await MilkEntry.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Milk entry statistics fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get milk entries by farmer
  getMilkEntriesByFarmer: async (req, res) => {
    try {
      const { farmerId } = req.params;
      const milkEntries = await MilkEntry.getByFarmer(farmerId);
      res.json({
        success: true,
        data: milkEntries,
        message: 'Farmer milk entries fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get milk entries by date range
  getMilkEntriesByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const milkEntries = await MilkEntry.getByDateRange(startDate, endDate);
      res.json({
        success: true,
        data: milkEntries,
        message: 'Milk entries fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = milkEntryController;
