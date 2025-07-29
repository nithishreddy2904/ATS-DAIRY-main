const { promisePool } = require('../config/database');

class Farmer {
  static async getAll() {
    try {
      console.log('Farmer.getAll() called');
      const [rows] = await promisePool.execute(
        'SELECT * FROM farmers ORDER BY created_at DESC'
      );
      console.log('Database returned:', rows.length, 'farmers');
      return rows;
    } catch (error) {
      console.error('Farmer.getAll() error:', error);
      throw new Error(`Error fetching farmers: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('Farmer.getById() called with id:', id);
      const [rows] = await promisePool.execute(
        'SELECT * FROM farmers WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Farmer.getById() error:', error);
      throw new Error(`Error fetching farmer: ${error.message}`);
    }
  }

  static async create(farmerData) {
    try {
      console.log('Farmer.create() called with:', farmerData);
      const {
        id, name, phone, email, address, cattle_count,
        bank_account, ifsc_code, status, join_date
      } = farmerData;

      const [result] = await promisePool.execute(
        `INSERT INTO farmers
         (id, name, phone, email, address, cattle_count, bank_account, ifsc_code, status, join_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, phone, email, address, cattle_count, bank_account, ifsc_code, status, join_date]
      );

      console.log('Farmer created successfully:', result);
      return { id, ...farmerData };
    } catch (error) {
      console.error('Farmer.create() error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Farmer ID, phone, or email already exists');
      }
      throw new Error(`Error creating farmer: ${error.message}`);
    }
  }

  static async update(id, farmerData) {
    try {
      console.log('Farmer.update() called with:', id, farmerData);
      const {
        name, phone, email, address, cattle_count,
        bank_account, ifsc_code, status, join_date
      } = farmerData;

      const [result] = await promisePool.execute(
        `UPDATE farmers
         SET name = ?, phone = ?, email = ?, address = ?, cattle_count = ?,
             bank_account = ?, ifsc_code = ?, status = ?, join_date = ?
         WHERE id = ?`,
        [name, phone, email, address, cattle_count, bank_account, ifsc_code, status, join_date, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Farmer not found');
      }

      console.log('Farmer updated successfully:', result);
      return { id, ...farmerData };
    } catch (error) {
      console.error('Farmer.update() error:', error);
      throw new Error(`Error updating farmer: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('Farmer.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM farmers WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Farmer not found');
      }

      console.log('Farmer deleted successfully');
      return { message: 'Farmer deleted successfully' };
    } catch (error) {
      console.error('Farmer.delete() error:', error);
      throw new Error(`Error deleting farmer: ${error.message}`);
    }
  }
}

module.exports = Farmer;
