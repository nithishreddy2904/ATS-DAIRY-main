const { promisePool } = require('../config/database');

class Payment {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM payments ORDER BY payment_date DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM payments WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { 
        farmer_id, payment_date, amount, payment_mode, 
        remarks, status, transaction_id 
      } = data;
      
      const [result] = await promisePool.query(
        `INSERT INTO payments (
          farmer_id, payment_date, amount, payment_mode, 
          remarks, status, transaction_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          farmer_id, payment_date, amount, payment_mode, 
          remarks, status, transaction_id
        ]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { 
        farmer_id, payment_date, amount, payment_mode, 
        remarks, status, transaction_id 
      } = data;
      
      await promisePool.query(
        `UPDATE payments SET 
          farmer_id=?, payment_date=?, amount=?, payment_mode=?, 
          remarks=?, status=?, transaction_id=?
         WHERE id=?`,
        [
          farmer_id, payment_date, amount, payment_mode, 
          remarks, status, transaction_id, id
        ]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM payments WHERE id=?', [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }
}

module.exports = Payment;
