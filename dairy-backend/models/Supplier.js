const { promisePool } = require('../config/database');

class Supplier {
  static async getAll() {
    try {
      console.log('Supplier.getAll() called');
      const [rows] = await promisePool.execute(
        'SELECT * FROM suppliers ORDER BY created_at DESC'
      );
      console.log('Database returned:', rows.length, 'suppliers');
      return rows;
    } catch (error) {
      console.error('Supplier.getAll() error:', error);
      throw new Error(`Error fetching suppliers: ${error.message}`);
    }
  }

  static async create(supplierData) {
    try {
      console.log('Supplier.create() called with:', supplierData);
      const {
        id, company_name, contact_person, phone, email, address,
        supplier_type, status, join_date
      } = supplierData;

      const [result] = await promisePool.execute(
        `INSERT INTO suppliers 
         (id, company_name, contact_person, phone, email, address, supplier_type, status, join_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, company_name, contact_person, phone, email, address, supplier_type, status, join_date]
      );

      console.log('Supplier created successfully:', result);
      return { id, ...supplierData };
    } catch (error) {
      console.error('Supplier.create() error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Supplier ID, phone, or email already exists');
      }
      throw new Error(`Error creating supplier: ${error.message}`);
    }
  }

  static async update(id, supplierData) {
    try {
      console.log('Supplier.update() called with:', id, supplierData);
      const {
        company_name, contact_person, phone, email, address,
        supplier_type, status, join_date
      } = supplierData;

      const [result] = await promisePool.execute(
        `UPDATE suppliers 
         SET company_name = ?, contact_person = ?, phone = ?, email = ?, address = ?, 
             supplier_type = ?, status = ?, join_date = ?
         WHERE id = ?`,
        [company_name, contact_person, phone, email, address, supplier_type, status, join_date, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Supplier not found');
      }

      console.log('Supplier updated successfully:', result);
      return { id, ...supplierData };
    } catch (error) {
      console.error('Supplier.update() error:', error);
      throw new Error(`Error updating supplier: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('Supplier.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM suppliers WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Supplier not found');
      }

      console.log('Supplier deleted successfully');
      return { message: 'Supplier deleted successfully' };
    } catch (error) {
      console.error('Supplier.delete() error:', error);
      throw new Error(`Error deleting supplier: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const [totalRows] = await promisePool.execute(
        'SELECT COUNT(*) as total FROM suppliers'
      );
      
      const [activeRows] = await promisePool.execute(
        'SELECT COUNT(*) as active FROM suppliers WHERE status = "Active"'
      );
      
      const [typeRows] = await promisePool.execute(
        'SELECT supplier_type, COUNT(*) as count FROM suppliers GROUP BY supplier_type'
      );

      return {
        total: totalRows[0].total,
        active: activeRows[0].active,
        typeDistribution: typeRows
      };
    } catch (error) {
      console.error('Supplier.getStats() error:', error);
      throw new Error(`Error fetching supplier stats: ${error.message}`);
    }
  }
}

module.exports = Supplier;
