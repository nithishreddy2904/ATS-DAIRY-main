const { promisePool } = require('../config/database');

class ComplianceRecord {
  static async getAll() {
    try {
      console.log('ComplianceRecord.getAll() called');
      const [rows] = await promisePool.execute(
        'SELECT * FROM compliance_records ORDER BY created_at DESC'
      );
      console.log('Database returned:', rows.length, 'compliance records');
      return rows;
    } catch (error) {
      console.error('ComplianceRecord.getAll() error:', error);
      throw new Error(`Error fetching compliance records: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('ComplianceRecord.getById() called with id:', id);
      const [rows] = await promisePool.execute(
        'SELECT * FROM compliance_records WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('ComplianceRecord.getById() error:', error);
      throw new Error(`Error fetching compliance record: ${error.message}`);
    }
  }

  static async create(recordData) {
    try {
      console.log('ComplianceRecord.create() called with:', recordData);
      const {
        id, type, title, description, status, priority, due_date,
        completed_date, assigned_to, responsible_department, compliance_officer,
        regulatory_body, license_number, validity_period, renewal_date,
        cost, remarks, risk_level, business_impact
      } = recordData;

      const [result] = await promisePool.execute(
        `INSERT INTO compliance_records 
        (id, type, title, description, status, priority, due_date, completed_date, 
         assigned_to, responsible_department, compliance_officer, regulatory_body, 
         license_number, validity_period, renewal_date, cost, remarks, risk_level, business_impact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, type, title, description, status, priority, due_date, completed_date,
         assigned_to, responsible_department, compliance_officer, regulatory_body,
         license_number, validity_period, renewal_date, cost, remarks, risk_level, business_impact]
      );

      console.log('Compliance record created successfully:', result);
      return { id, ...recordData };
    } catch (error) {
      console.error('ComplianceRecord.create() error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Compliance record ID already exists');
      }
      throw new Error(`Error creating compliance record: ${error.message}`);
    }
  }

  static async update(id, recordData) {
    try {
      console.log('ComplianceRecord.update() called with:', id, recordData);
      const {
        type, title, description, status, priority, due_date,
        completed_date, assigned_to, responsible_department, compliance_officer,
        regulatory_body, license_number, validity_period, renewal_date,
        cost, remarks, risk_level, business_impact
      } = recordData;

      const [result] = await promisePool.execute(
        `UPDATE compliance_records 
        SET type = ?, title = ?, description = ?, status = ?, priority = ?, 
            due_date = ?, completed_date = ?, assigned_to = ?, responsible_department = ?, 
            compliance_officer = ?, regulatory_body = ?, license_number = ?, 
            validity_period = ?, renewal_date = ?, cost = ?, remarks = ?, 
            risk_level = ?, business_impact = ?
        WHERE id = ?`,
        [type, title, description, status, priority, due_date, completed_date,
         assigned_to, responsible_department, compliance_officer, regulatory_body,
         license_number, validity_period, renewal_date, cost, remarks,
         risk_level, business_impact, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Compliance record not found');
      }

      console.log('Compliance record updated successfully:', result);
      return { id, ...recordData };
    } catch (error) {
      console.error('ComplianceRecord.update() error:', error);
      throw new Error(`Error updating compliance record: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('ComplianceRecord.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM compliance_records WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Compliance record not found');
      }

      console.log('Compliance record deleted successfully');
      return { message: 'Compliance record deleted successfully' };
    } catch (error) {
      console.error('ComplianceRecord.delete() error:', error);
      throw new Error(`Error deleting compliance record: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      console.log('ComplianceRecord.getStats() called');
      const [rows] = await promisePool.execute(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Compliant' THEN 1 ELSE 0 END) as compliant,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'Non-Compliant' THEN 1 ELSE 0 END) as non_compliant,
          SUM(CASE WHEN priority = 'Critical' THEN 1 ELSE 0 END) as critical,
          SUM(CASE WHEN due_date < CURDATE() AND status != 'Compliant' THEN 1 ELSE 0 END) as overdue
        FROM compliance_records
      `);
      return rows[0];
    } catch (error) {
      console.error('ComplianceRecord.getStats() error:', error);
      throw new Error(`Error fetching compliance statistics: ${error.message}`);
    }
  }
}

module.exports = ComplianceRecord;
