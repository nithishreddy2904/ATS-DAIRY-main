const { promisePool } = require('../config/database');

class Message {
  static async getAll() {
    try {
      console.log('Message.getAll() called');
      const [rows] = await promisePool.execute(
        'SELECT * FROM messages ORDER BY created_at DESC'
      );
      console.log('Database returned:', rows.length, 'messages');
      return rows;
    } catch (error) {
      console.error('Message.getAll() error:', error);
      throw new Error(`Error fetching messages: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('Message.getById() called with id:', id);
      const [rows] = await promisePool.execute(
        'SELECT * FROM messages WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Message.getById() error:', error);
      throw new Error(`Error fetching message: ${error.message}`);
    }
  }

  static async getByFarmerId(farmerId) {
    try {
      console.log('Message.getByFarmerId() called with farmerId:', farmerId);
      const [rows] = await promisePool.execute(
        'SELECT * FROM messages WHERE farmer_id = ? ORDER BY created_at DESC',
        [farmerId]
      );
      return rows;
    } catch (error) {
      console.error('Message.getByFarmerId() error:', error);
      throw new Error(`Error fetching messages for farmer: ${error.message}`);
    }
  }

  static async create(messageData) {
    try {
      console.log('Message.create() called with:', messageData);
      const {
        id, farmer_id, subject, message, timestamp, status, priority
      } = messageData;

      const [result] = await promisePool.execute(
        `INSERT INTO messages
        (id, farmer_id, subject, message, timestamp, status, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, farmer_id, subject, message, timestamp, status, priority]
      );

      console.log('Message created successfully:', result);
      return { id, ...messageData };
    } catch (error) {
      console.error('Message.create() error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Message ID already exists');
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('Farmer ID does not exist');
      }
      throw new Error(`Error creating message: ${error.message}`);
    }
  }

  static async update(id, messageData) {
    try {
      console.log('Message.update() called with:', id, messageData);
      const {
        farmer_id, subject, message, timestamp, status, priority
      } = messageData;

      const [result] = await promisePool.execute(
        `UPDATE messages
        SET farmer_id = ?, subject = ?, message = ?, timestamp = ?, status = ?, priority = ?
        WHERE id = ?`,
        [farmer_id, subject, message, timestamp, status, priority, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Message not found');
      }

      console.log('Message updated successfully:', result);
      return { id, ...messageData };
    } catch (error) {
      console.error('Message.update() error:', error);
      throw new Error(`Error updating message: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('Message.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM messages WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Message not found');
      }

      console.log('Message deleted successfully');
      return { message: 'Message deleted successfully' };
    } catch (error) {
      console.error('Message.delete() error:', error);
      throw new Error(`Error deleting message: ${error.message}`);
    }
  }

  static async updateStatus(id, status) {
    try {
      console.log('Message.updateStatus() called with:', id, status);
      const [result] = await promisePool.execute(
        'UPDATE messages SET status = ? WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Message not found');
      }

      console.log('Message status updated successfully');
      return { id, status };
    } catch (error) {
      console.error('Message.updateStatus() error:', error);
      throw new Error(`Error updating message status: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      console.log('Message.getStats() called');
      const [totalRows] = await promisePool.execute('SELECT COUNT(*) as total FROM messages');
      const [statusRows] = await promisePool.execute(
        'SELECT status, COUNT(*) as count FROM messages GROUP BY status'
      );
      const [priorityRows] = await promisePool.execute(
        'SELECT priority, COUNT(*) as count FROM messages GROUP BY priority'
      );

      return {
        total: totalRows[0].total,
        byStatus: statusRows,
        byPriority: priorityRows
      };
    } catch (error) {
      console.error('Message.getStats() error:', error);
      throw new Error(`Error fetching message stats: ${error.message}`);
    }
  }
}

module.exports = Message;
