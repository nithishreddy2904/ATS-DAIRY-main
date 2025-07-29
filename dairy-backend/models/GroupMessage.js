const { promisePool } = require('../config/database');

class GroupMessage {
  static async getAll() {
    try {
      console.log('GroupMessage.getAll() called');
      const [rows] = await promisePool.execute(
        'SELECT * FROM group_messages ORDER BY timestamp DESC'
      );
      console.log('Database returned:', rows.length, 'group messages');
      return rows;
    } catch (error) {
      console.error('GroupMessage.getAll() error:', error);
      throw new Error(`Error fetching group messages: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('GroupMessage.getById() called with id:', id);
      const [rows] = await promisePool.execute(
        'SELECT * FROM group_messages WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('GroupMessage.getById() error:', error);
      throw new Error(`Error fetching group message: ${error.message}`);
    }
  }

  static async create(messageData) {
    try {
      console.log('GroupMessage.create() called with:', messageData);
      const {
        group_name, message, sender_name, member_count, timestamp
      } = messageData;

      const [result] = await promisePool.execute(
        `INSERT INTO group_messages 
         (group_name, message, sender_name, member_count, timestamp) 
         VALUES (?, ?, ?, ?, ?)`,
        [group_name, message, sender_name, member_count, timestamp]
      );

      console.log('Group message created successfully:', result);
      
      // Return the created message with the new ID
      const newMessage = {
        id: result.insertId,
        group_name,
        message,
        sender_name,
        member_count,
        timestamp
      };
      
      return newMessage;
    } catch (error) {
      console.error('GroupMessage.create() error:', error);
      throw new Error(`Error creating group message: ${error.message}`);
    }
  }

  static async update(id, messageData) {
    try {
      console.log('GroupMessage.update() called with:', id, messageData);
      const {
        group_name, message, sender_name, member_count, timestamp
      } = messageData;

      const [result] = await promisePool.execute(
        `UPDATE group_messages 
         SET group_name = ?, message = ?, sender_name = ?, member_count = ?, timestamp = ?
         WHERE id = ?`,
        [group_name, message, sender_name, member_count, timestamp, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Group message not found');
      }

      console.log('Group message updated successfully:', result);
      return { id, ...messageData };
    } catch (error) {
      console.error('GroupMessage.update() error:', error);
      throw new Error(`Error updating group message: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('GroupMessage.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM group_messages WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Group message not found');
      }

      console.log('Group message deleted successfully');
      return { message: 'Group message deleted successfully' };
    } catch (error) {
      console.error('GroupMessage.delete() error:', error);
      throw new Error(`Error deleting group message: ${error.message}`);
    }
  }

  static async getByGroupName(groupName) {
    try {
      console.log('GroupMessage.getByGroupName() called with:', groupName);
      const [rows] = await promisePool.execute(
        'SELECT * FROM group_messages WHERE group_name = ? ORDER BY timestamp DESC',
        [groupName]
      );
      return rows;
    } catch (error) {
      console.error('GroupMessage.getByGroupName() error:', error);
      throw new Error(`Error fetching group messages by group name: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      console.log('GroupMessage.getStats() called');
      const [totalRows] = await promisePool.execute(
        'SELECT COUNT(*) as total FROM group_messages'
      );
      
      const [groupsRows] = await promisePool.execute(
        'SELECT COUNT(DISTINCT group_name) as unique_groups FROM group_messages'
      );
      
      const [recentRows] = await promisePool.execute(
        'SELECT COUNT(*) as recent FROM group_messages WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
      );

      return {
        total: totalRows[0].total,
        unique_groups: groupsRows[0].unique_groups,
        recent_messages: recentRows[0].recent
      };
    } catch (error) {
      console.error('GroupMessage.getStats() error:', error);
      throw new Error(`Error fetching group message stats: ${error.message}`);
    }
  }
}

module.exports = GroupMessage;
