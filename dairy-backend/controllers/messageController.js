const Message = require('../models/Message');
const { validationResult } = require('express-validator');

const messageController = {
  getAllMessages: async (req, res) => {
    try {
      const messages = await Message.getAll();
      res.json({
        success: true,
        data: messages,
        message: 'Messages fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getMessageById: async (req, res) => {
    try {
      const { id } = req.params;
      const message = await Message.getById(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }

      res.json({
        success: true,
        data: message,
        message: 'Message fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getMessagesByFarmerId: async (req, res) => {
    try {
      const { farmerId } = req.params;
      const messages = await Message.getByFarmerId(farmerId);
      res.json({
        success: true,
        data: messages,
        message: 'Messages fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createMessage: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const message = await Message.create(req.body);
      res.status(201).json({
        success: true,
        data: message,
        message: 'Message created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateMessage: async (req, res) => {
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
      const message = await Message.update(id, req.body);
      res.json({
        success: true,
        data: message,
        message: 'Message updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params;
      await Message.delete(id);
      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateMessageStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const result = await Message.updateStatus(id, status);
      res.json({
        success: true,
        data: result,
        message: 'Message status updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getMessageStats: async (req, res) => {
    try {
      const stats = await Message.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Message statistics fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = messageController;
