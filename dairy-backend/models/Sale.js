const { promisePool } = require('../config/database');

class Sale {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM sales ORDER BY date DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM sales WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { date, retailer, amount } = data;
      const saleAmount = parseFloat(amount);
      
      // Start transaction
      await promisePool.query('START TRANSACTION');
      
      // Insert sale
      const [result] = await promisePool.query(
        'INSERT INTO sales (date, retailer, amount) VALUES (?, ?, ?)',
        [date, retailer, saleAmount]
      );
      
      // Update retailer total
      await promisePool.query(
        'UPDATE retailers SET total_sales = total_sales + ? WHERE name = ?',
        [saleAmount, retailer]
      );
      
      // Commit transaction
      await promisePool.query('COMMIT');
      
      return { id: result.insertId, date, retailer, amount: saleAmount };
    } catch (error) {
      // Rollback transaction on error
      await promisePool.query('ROLLBACK');
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { date, retailer, amount } = data;
      const newAmount = parseFloat(amount);
      
      // Get old sale data
      const [oldSale] = await promisePool.query('SELECT * FROM sales WHERE id = ?', [id]);
      if (!oldSale.length) throw new Error('Sale not found');
      
      const oldSaleData = oldSale[0];
      
      // Start transaction
      await promisePool.query('START TRANSACTION');
      
      // Update sale
      await promisePool.query(
        'UPDATE sales SET date=?, retailer=?, amount=? WHERE id=?',
        [date, retailer, newAmount, id]
      );
      
      // If retailer changed, update both old and new retailer totals
      if (oldSaleData.retailer !== retailer) {
        // Remove from old retailer
        await promisePool.query(
          'UPDATE retailers SET total_sales = total_sales - ? WHERE name = ?',
          [oldSaleData.amount, oldSaleData.retailer]
        );
        // Add to new retailer
        await promisePool.query(
          'UPDATE retailers SET total_sales = total_sales + ? WHERE name = ?',
          [newAmount, retailer]
        );
      } else {
        // Same retailer, just update the difference
        const difference = newAmount - oldSaleData.amount;
        await promisePool.query(
          'UPDATE retailers SET total_sales = total_sales + ? WHERE name = ?',
          [difference, retailer]
        );
      }
      
      // Commit transaction
      await promisePool.query('COMMIT');
      
      return { id, date, retailer, amount: newAmount };
    } catch (error) {
      // Rollback transaction on error
      await promisePool.query('ROLLBACK');
      console.error('Error updating sale:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Get sale data before deletion
      const [saleData] = await promisePool.query('SELECT * FROM sales WHERE id = ?', [id]);
      if (!saleData.length) throw new Error('Sale not found');
      
      const sale = saleData[0];
      
      // Start transaction
      await promisePool.query('START TRANSACTION');
      
      // Delete sale
      const [result] = await promisePool.query('DELETE FROM sales WHERE id=?', [id]);
      
      // Update retailer total
      await promisePool.query(
        'UPDATE retailers SET total_sales = total_sales - ? WHERE name = ?',
        [sale.amount, sale.retailer]
      );
      
      // Commit transaction
      await promisePool.query('COMMIT');
      
      return result.affectedRows > 0;
    } catch (error) {
      // Rollback transaction on error
      await promisePool.query('ROLLBACK');
      console.error('Error deleting sale:', error);
      throw error;
    }
  }
}

module.exports = Sale;
