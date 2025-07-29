const { promisePool } = require('../config/database');

class Bill {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM bills ORDER BY bill_date DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM bills WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching bill:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { 
        bill_id, farmer_id, bill_date, due_date, amount, 
        description, status, category 
      } = data;
      
      const [result] = await promisePool.query(
        `INSERT INTO bills (
          bill_id, farmer_id, bill_date, due_date, amount, 
          description, status, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bill_id, farmer_id, bill_date, due_date, amount, 
          description, status, category
        ]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { 
        bill_id, farmer_id, bill_date, due_date, amount, 
        description, status, category 
      } = data;
      
      await promisePool.query(
        `UPDATE bills SET 
          bill_id=?, farmer_id=?, bill_date=?, due_date=?, amount=?, 
          description=?, status=?, category=?
         WHERE id=?`,
        [
          bill_id, farmer_id, bill_date, due_date, amount, 
          description, status, category, id
        ]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM bills WHERE id=?', [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  }
}

module.exports = Bill;
