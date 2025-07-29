const { promisePool } = require('../config/database');

class InventoryRecord {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM inventory_records ORDER BY item_name'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching inventory records:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM inventory_records WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching inventory record:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { 
        item_code, 
        item_name, 
        category, 
        current_stock_level, 
        unit, 
        minimum_stock_level, 
        maximum_stock_level, 
        location, 
        status, 
        last_updated, 
        supplier 
      } = data;
      
      const [result] = await promisePool.query(
        `INSERT INTO inventory_records (
          item_code, item_name, category, current_stock_level, unit, 
          minimum_stock_level, maximum_stock_level, location, status, last_updated, supplier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item_code, item_name, category, current_stock_level, unit, 
          minimum_stock_level, maximum_stock_level, location, status, last_updated, supplier
        ]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error creating inventory record:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { 
        item_code, 
        item_name, 
        category, 
        current_stock_level, 
        unit, 
        minimum_stock_level, 
        maximum_stock_level, 
        location, 
        status, 
        last_updated, 
        supplier 
      } = data;
      
      await promisePool.query(
        `UPDATE inventory_records SET 
          item_code=?, item_name=?, category=?, current_stock_level=?, unit=?, 
          minimum_stock_level=?, maximum_stock_level=?, location=?, status=?, last_updated=?, supplier=?
         WHERE id=?`,
        [
          item_code, item_name, category, current_stock_level, unit, 
          minimum_stock_level, maximum_stock_level, location, status, last_updated, supplier, id
        ]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error updating inventory record:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM inventory_records WHERE id=?', [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting inventory record:', error);
      throw error;
    }
  }
}

module.exports = InventoryRecord;
