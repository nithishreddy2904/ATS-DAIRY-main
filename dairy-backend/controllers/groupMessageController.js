const GroupMessage = require('../models/GroupMessage');
const { validationResult } = require('express-validator');

const groupMessageController = {
  getAllGroupMessages: async (req, res) => {
    try {
      const groupMessages = await GroupMessage.getAll();
      res.json({
        success: true,
        data: groupMessages,
        message: 'Group messages fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getGroupMessageById: async (req, res) => {
    try {
      const { id } = req.params;
      const groupMessage = await GroupMessage.getById(id);
      
      if (!groupMessage) {
        return res.status(404).json({
          success: false,
          message: 'Group message not found'
        });
      }

      res.json({
        success: true,
        data: groupMessage,
        message: 'Group message fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createGroupMessage: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const groupMessage = await GroupMessage.create(req.body);
      res.status(201).json({
        success: true,
        data: groupMessage,
        message: 'Group message created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateGroupMessage: async (req, res) => {
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
      const groupMessage = await GroupMessage.update(id, req.body);
      res.json({
        success: true,
        data: groupMessage,
        message: 'Group message updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteGroupMessage: async (req, res) => {
    try {
      const { id } = req.params;
      await GroupMessage.delete(id);
      res.json({
        success: true,
        message: 'Group message deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getGroupMessagesByGroupName: async (req, res) => {
    try {
      const { groupName } = req.params;
      const groupMessages = await GroupMessage.getByGroupName(groupName);
      res.json({
        success: true,
        data: groupMessages,
        message: `Group messages for ${groupName} fetched successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getGroupMessageStats: async (req, res) => {
    try {
      const stats = await GroupMessage.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Group message statistics fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = groupMessageController;
