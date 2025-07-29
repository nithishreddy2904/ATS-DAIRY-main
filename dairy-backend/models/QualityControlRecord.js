const { promisePool } = require('../config/database');

class QualityControlRecord {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM quality_control_records ORDER BY test_date DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching quality control records:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM quality_control_records WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching quality control record:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { batch_id, unit_id, test_date, fat, protein, moisture, ph, result, inspector } = data;
      const [resultObj] = await promisePool.query(
        `INSERT INTO quality_control_records (batch_id, unit_id, test_date, fat, protein, moisture, ph, result, inspector)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [batch_id, unit_id, test_date, fat, protein, moisture, ph, result, inspector]
      );
      return { id: resultObj.insertId, ...data };
    } catch (error) {
      console.error('Error creating quality control record:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { batch_id, unit_id, test_date, fat, protein, moisture, ph, result, inspector } = data;
      await promisePool.query(
        `UPDATE quality_control_records SET batch_id=?, unit_id=?, test_date=?, fat=?, protein=?, moisture=?, ph=?, result=?, inspector=?
         WHERE id=?`,
        [batch_id, unit_id, test_date, fat, protein, moisture, ph, result, inspector, id]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error updating quality control record:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM quality_control_records WHERE id=?', [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting quality control record:', error);
      throw error;
    }
  }
}

module.exports = QualityControlRecord;
