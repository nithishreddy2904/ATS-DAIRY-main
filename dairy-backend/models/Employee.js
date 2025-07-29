const { promisePool } = require('../config/database');

class Employee {
  static async getAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM employees ORDER BY name'
      );
      return rows;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM employees WHERE id = ?', [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { 
        employee_id, name, position, department, phone, email, salary, 
        join_date, status, address, emergency_contact, experience, 
        qualification, blood_group, date_of_birth 
      } = data;
      
      const [result] = await promisePool.query(
        `INSERT INTO employees (
          employee_id, name, position, department, phone, email, salary, 
          join_date, status, address, emergency_contact, experience, 
          qualification, blood_group, date_of_birth
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employee_id, name, position, department, phone, email, salary, 
          join_date, status, address, emergency_contact, experience, 
          qualification, blood_group, date_of_birth
        ]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { 
        employee_id, name, position, department, phone, email, salary, 
        join_date, status, address, emergency_contact, experience, 
        qualification, blood_group, date_of_birth 
      } = data;
      
      await promisePool.query(
        `UPDATE employees SET 
          employee_id=?, name=?, position=?, department=?, phone=?, email=?, salary=?, 
          join_date=?, status=?, address=?, emergency_contact=?, experience=?, 
          qualification=?, blood_group=?, date_of_birth=?
         WHERE id=?`,
        [
          employee_id, name, position, department, phone, email, salary, 
          join_date, status, address, emergency_contact, experience, 
          qualification, blood_group, date_of_birth, id
        ]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM employees WHERE id=?', [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
}

module.exports = Employee;
