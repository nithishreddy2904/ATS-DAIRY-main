const Supplier = require('../models/Supplier');
const { validationResult } = require('express-validator');

const supplierController = {
  // Get all suppliers
  getAllSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.getAll();
      res.json({
        success: true,
        data: suppliers,
        message: 'Suppliers fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get supplier by ID
  getSupplierById: async (req, res) => {
    try {
      const { id } = req.params;
      const supplier = await Supplier.getById(id);
      
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Supplier not found'
        });
      }

      res.json({
        success: true,
        data: supplier,
        message: 'Supplier fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create new supplier
  createSupplier: async (req, res) => {
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

      const supplier = await Supplier.create(req.body);
      res.status(201).json({
        success: true,
        data: supplier,
        message: 'Supplier created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update supplier
  updateSupplier: async (req, res) => {
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
      const supplier = await Supplier.update(id, req.body);
      
      res.json({
        success: true,
        data: supplier,
        message: 'Supplier updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete supplier
  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      await Supplier.delete(id);
      
      res.json({
        success: true,
        message: 'Supplier deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get supplier statistics
  getSupplierStats: async (req, res) => {
    try {
      const stats = await Supplier.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Supplier statistics fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = supplierController;
