const { promisePool } = require('../config/database');

class MaintenanceRecord {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM maintenance_records ORDER BY date DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM maintenance_records WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching maintenance record:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { unit_id, date, type, description, cost, technician, status } = data;
      const [result] = await promisePool.query(
        `INSERT INTO maintenance_records (unit_id, date, type, description, cost, technician, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [unit_id, date, type, description, cost, technician, status]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { unit_id, date, type, description, cost, technician, status } = data;
      await promisePool.query(
        `UPDATE maintenance_records SET unit_id=?, date=?, type=?, description=?, cost=?, technician=?, status=?
         WHERE id=?`,
        [unit_id, date, type, description, cost, technician, status, id]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM maintenance_records WHERE id=?', [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      throw error;
    }
  }
}

module.exports = MaintenanceRecord;
