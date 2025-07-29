const { promisePool } = require('../config/database');

class Retailer {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM retailers ORDER BY total_sales DESC, created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching retailers:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM retailers WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching retailer:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { name, location, contact, total_sales = 0 } = data;
      const [result] = await promisePool.query(
        'INSERT INTO retailers (name, location, contact, total_sales) VALUES (?, ?, ?, ?)',
        [name, location, contact, total_sales]
      );
      return { id: result.insertId, ...data, total_sales };
    } catch (error) {
      console.error('Error creating retailer:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { name, location, contact, total_sales } = data;
      await promisePool.query(
        'UPDATE retailers SET name=?, location=?, contact=?, total_sales=? WHERE id=?',
        [name, location, contact, total_sales || 0, id]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error updating retailer:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM retailers WHERE id=?', [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting retailer:', error);
      throw error;
    }
  }

  // Update retailer's total sales
  static async updateTotalSales(retailerName, amount) {
    try {
      await promisePool.query(
        'UPDATE retailers SET total_sales = total_sales + ? WHERE name = ?',
        [amount, retailerName]
      );
    } catch (error) {
      console.error('Error updating retailer total sales:', error);
      throw error;
    }
  }

  // Recalculate total sales for a retailer
  static async recalculateTotalSales(retailerName) {
    try {
      const [result] = await promisePool.query(
        `UPDATE retailers r 
         SET total_sales = (
           SELECT COALESCE(SUM(s.amount), 0) 
           FROM sales s 
           WHERE s.retailer = r.name
         ) 
         WHERE r.name = ?`,
        [retailerName]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error recalculating retailer total sales:', error);
      throw error;
    }
  }
}

module.exports = Retailer;
