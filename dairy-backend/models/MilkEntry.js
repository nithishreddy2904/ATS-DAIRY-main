const { promisePool } = require('../config/database');

class MilkEntry {
  static async getAll() {
    try {
      console.log('MilkEntry.getAll() called');
      const [rows] = await promisePool.execute(
        `SELECT me.*, f.name as farmer_name 
         FROM milk_entries me 
         LEFT JOIN farmers f ON me.farmer_id = f.id 
         ORDER BY me.date DESC, me.created_at DESC`
      );
      console.log('Database returned:', rows.length, 'milk entries');
      return rows;
    } catch (error) {
      console.error('MilkEntry.getAll() error:', error);
      throw new Error(`Error fetching milk entries: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('MilkEntry.getById() called with id:', id);
      const [rows] = await promisePool.execute(
        `SELECT me.*, f.name as farmer_name 
         FROM milk_entries me 
         LEFT JOIN farmers f ON me.farmer_id = f.id 
         WHERE me.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('MilkEntry.getById() error:', error);
      throw new Error(`Error fetching milk entry: ${error.message}`);
    }
  }

  static async create(entryData) {
    try {
      console.log('MilkEntry.create() called with:', entryData);
      const {
        farmer_id, farmer_name, date, quantity, shift, quality,
        fat_content, snf_content, temperature, ph_level,
        collection_center, collected_by, vehicle_number, remarks,
        payment_amount, payment_status
      } = entryData;

      const [result] = await promisePool.execute(
        `INSERT INTO milk_entries 
         (farmer_id, farmer_name, date, quantity, shift, quality, fat_content, 
          snf_content, temperature, ph_level, collection_center, collected_by, 
          vehicle_number, remarks, payment_amount, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [farmer_id, farmer_name, date, quantity, shift, quality, fat_content,
         snf_content, temperature, ph_level, collection_center, collected_by,
         vehicle_number, remarks, payment_amount, payment_status]
      );

      console.log('Milk entry created successfully:', result);
      return { id: result.insertId, ...entryData };
    } catch (error) {
      console.error('MilkEntry.create() error:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('Farmer ID does not exist');
      }
      throw new Error(`Error creating milk entry: ${error.message}`);
    }
  }

  static async update(id, entryData) {
    try {
      console.log('MilkEntry.update() called with:', id, entryData);
      const {
        farmer_id, farmer_name, date, quantity, shift, quality,
        fat_content, snf_content, temperature, ph_level,
        collection_center, collected_by, vehicle_number, remarks,
        payment_amount, payment_status
      } = entryData;

      const [result] = await promisePool.execute(
        `UPDATE milk_entries 
         SET farmer_id = ?, farmer_name = ?, date = ?, quantity = ?, shift = ?, 
             quality = ?, fat_content = ?, snf_content = ?, temperature = ?, 
             ph_level = ?, collection_center = ?, collected_by = ?, 
             vehicle_number = ?, remarks = ?, payment_amount = ?, payment_status = ?
         WHERE id = ?`,
        [farmer_id, farmer_name, date, quantity, shift, quality, fat_content,
         snf_content, temperature, ph_level, collection_center, collected_by,
         vehicle_number, remarks, payment_amount, payment_status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Milk entry not found');
      }

      console.log('Milk entry updated successfully:', result);
      return { id, ...entryData };
    } catch (error) {
      console.error('MilkEntry.update() error:', error);
      throw new Error(`Error updating milk entry: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('MilkEntry.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM milk_entries WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Milk entry not found');
      }

      console.log('Milk entry deleted successfully');
      return { message: 'Milk entry deleted successfully' };
    } catch (error) {
      console.error('MilkEntry.delete() error:', error);
      throw new Error(`Error deleting milk entry: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const [totalRows] = await promisePool.execute(
        'SELECT COUNT(*) as total_entries, SUM(quantity) as total_quantity FROM milk_entries'
      );
      
      const [qualityRows] = await promisePool.execute(
        'SELECT quality, COUNT(*) as count FROM milk_entries GROUP BY quality'
      );

      const [shiftRows] = await promisePool.execute(
        'SELECT shift, COUNT(*) as count, SUM(quantity) as total_quantity FROM milk_entries GROUP BY shift'
      );

      const [monthlyRows] = await promisePool.execute(
        `SELECT DATE_FORMAT(date, '%Y-%m') as month, 
                COUNT(*) as entries, 
                SUM(quantity) as quantity,
                AVG(fat_content) as avg_fat,
                AVG(snf_content) as avg_snf
         FROM milk_entries 
         WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
         GROUP BY DATE_FORMAT(date, '%Y-%m')
         ORDER BY month DESC`
      );

      return {
        totalEntries: totalRows[0].total_entries || 0,
        totalQuantity: totalRows[0].total_quantity || 0,
        qualityDistribution: qualityRows,
        shiftDistribution: shiftRows,
        monthlyTrends: monthlyRows
      };
    } catch (error) {
      console.error('MilkEntry.getStats() error:', error);
      throw new Error(`Error fetching milk entry stats: ${error.message}`);
    }
  }

  static async getByFarmer(farmerId) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT * FROM milk_entries 
         WHERE farmer_id = ? 
         ORDER BY date DESC, created_at DESC`,
        [farmerId]
      );
      return rows;
    } catch (error) {
      console.error('MilkEntry.getByFarmer() error:', error);
      throw new Error(`Error fetching farmer milk entries: ${error.message}`);
    }
  }

  static async getByDateRange(startDate, endDate) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT me.*, f.name as farmer_name 
         FROM milk_entries me 
         LEFT JOIN farmers f ON me.farmer_id = f.id 
         WHERE me.date BETWEEN ? AND ?
         ORDER BY me.date DESC, me.created_at DESC`,
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      console.error('MilkEntry.getByDateRange() error:', error);
      throw new Error(`Error fetching milk entries by date range: ${error.message}`);
    }
  }
}

module.exports = MilkEntry;
