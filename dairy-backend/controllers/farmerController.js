const Farmer = require('../models/Farmer');
const { validationResult } = require('express-validator');

const farmerController = {
  getAllFarmers: async (req, res) => {
    try {
      const farmers = await Farmer.getAll();
      res.json({
        success: true,
        data: farmers,
        message: 'Farmers fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createFarmer: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const farmer = await Farmer.create(req.body);

      // Emit real-time event for creation - only if Socket.IO is available
      const io = req.app.get('socketio');
      if (io) {
        io.emit('farmer:created', { action: 'create', data: farmer });
      }

      res.status(201).json({
        success: true,
        data: farmer,
        message: 'Farmer created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateFarmer: async (req, res) => {
    try {
      const { id } = req.params;
      const farmer = await Farmer.update(id, req.body);

      // Emit real-time event for update
      const io = req.app.get('socketio');
      if (io) {
        io.emit('farmer:updated', { action: 'update', data: farmer });
      }

      res.json({
        success: true,
        data: farmer,
        message: 'Farmer updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteFarmer: async (req, res) => {
    try {
      const { id } = req.params;
      await Farmer.delete(id);

      // Emit real-time event for deletion
      const io = req.app.get('socketio');
      if (io) {
        io.emit('farmer:deleted', { action: 'delete', data: { id } });
      }

      res.json({
        success: true,
        message: 'Farmer deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = farmerController;
