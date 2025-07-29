const { promisePool } = require('../config/database');

class Certification {
  static async getAll() {
    try {
      console.log('Certification.getAll() called');
      const [rows] = await promisePool.execute(
        'SELECT * FROM certifications ORDER BY created_at DESC'
      );
      console.log('Database returned:', rows.length, 'certifications');
      return rows;
    } catch (error) {
      console.error('Certification.getAll() error:', error);
      throw new Error(`Error fetching certifications: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('Certification.getById() called with id:', id);
      const [rows] = await promisePool.execute(
        'SELECT * FROM certifications WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Certification.getById() error:', error);
      throw new Error(`Error fetching certification: ${error.message}`);
    }
  }

  static async create(certData) {
    try {
      console.log('Certification.create() called with:', certData);
      const {
        id, name, issuing_authority, certificate_number, issue_date,
        expiry_date, status, renewal_required, document_path, scope,
        accreditation_body, surveillance_date, cost, validity_period,
        benefits, maintenance_requirements
      } = certData;

      const [result] = await promisePool.execute(
        `INSERT INTO certifications 
        (id, name, issuing_authority, certificate_number, issue_date, expiry_date, 
         status, renewal_required, document_path, scope, accreditation_body, 
         surveillance_date, cost, validity_period, benefits, maintenance_requirements)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, issuing_authority, certificate_number, issue_date, expiry_date,
         status, renewal_required, document_path, scope, accreditation_body,
         surveillance_date, cost, validity_period, benefits, maintenance_requirements]
      );

      console.log('Certification created successfully:', result);
      return { id, ...certData };
    } catch (error) {
      console.error('Certification.create() error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Certification ID or certificate number already exists');
      }
      throw new Error(`Error creating certification: ${error.message}`);
    }
  }

  static async update(id, certData) {
    try {
      console.log('Certification.update() called with:', id, certData);
      const {
        name, issuing_authority, certificate_number, issue_date,
        expiry_date, status, renewal_required, document_path, scope,
        accreditation_body, surveillance_date, cost, validity_period,
        benefits, maintenance_requirements
      } = certData;

      const [result] = await promisePool.execute(
        `UPDATE certifications 
        SET name = ?, issuing_authority = ?, certificate_number = ?, issue_date = ?, 
            expiry_date = ?, status = ?, renewal_required = ?, document_path = ?, 
            scope = ?, accreditation_body = ?, surveillance_date = ?, cost = ?, 
            validity_period = ?, benefits = ?, maintenance_requirements = ?
        WHERE id = ?`,
        [name, issuing_authority, certificate_number, issue_date, expiry_date,
         status, renewal_required, document_path, scope, accreditation_body,
         surveillance_date, cost, validity_period, benefits, maintenance_requirements, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Certification not found');
      }

      console.log('Certification updated successfully:', result);
      return { id, ...certData };
    } catch (error) {
      console.error('Certification.update() error:', error);
      throw new Error(`Error updating certification: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('Certification.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM certifications WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Certification not found');
      }

      console.log('Certification deleted successfully');
      return { message: 'Certification deleted successfully' };
    } catch (error) {
      console.error('Certification.delete() error:', error);
      throw new Error(`Error deleting certification: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      console.log('Certification.getStats() called');
      const [rows] = await promisePool.execute(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'Expired' THEN 1 ELSE 0 END) as expired,
          SUM(CASE WHEN status = 'Pending Renewal' THEN 1 ELSE 0 END) as pending_renewal,
          SUM(CASE WHEN expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as expiring_soon
        FROM certifications
      `);
      return rows[0];
    } catch (error) {
      console.error('Certification.getStats() error:', error);
      throw new Error(`Error fetching certification statistics: ${error.message}`);
    }
  }

  static async getExpiring(days) {
    try {
      console.log('Certification.getExpiring() called with days:', days);
      const [rows] = await promisePool.execute(
        'SELECT * FROM certifications WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) ORDER BY expiry_date ASC',
        [days]
      );
      return rows;
    } catch (error) {
      console.error('Certification.getExpiring() error:', error);
      throw new Error(`Error fetching expiring certifications: ${error.message}`);
    }
  }
}

module.exports = Certification;
