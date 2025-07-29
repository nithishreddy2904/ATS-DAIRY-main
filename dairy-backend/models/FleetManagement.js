const { promisePool } = require('../config/database');

class FleetManagement {
  static async getAll() {
    try {
      console.log('FleetManagement.getAll() called');
      const [rows] = await promisePool.execute(
        'SELECT * FROM fleet_management ORDER BY created_at DESC'
      );
      console.log('Database returned:', rows.length, 'fleet records');
      return rows;
    } catch (error) {
      console.error('FleetManagement.getAll() error:', error);
      throw new Error(`Error fetching fleet data: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('FleetManagement.getById() called with id:', id);
      const [rows] = await promisePool.execute(
        'SELECT * FROM fleet_management WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('FleetManagement.getById() error:', error);
      throw new Error(`Error fetching fleet record: ${error.message}`);
    }
  }

  static async create(fleetData) {
    try {
      console.log('FleetManagement.create() called with:', fleetData);
      const {
        id, vehicle_number, vehicle_type, driver_name, driver_phone,
        capacity, status, last_maintenance_date, next_maintenance_date, location, fuel_type
      } = fleetData;

      const [result] = await promisePool.execute(
        `INSERT INTO fleet_management 
         (id, vehicle_number, vehicle_type, driver_name, driver_phone, capacity, status, last_maintenance_date, next_maintenance_date, location, fuel_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, vehicle_number, vehicle_type, driver_name, driver_phone, capacity, status, last_maintenance_date, next_maintenance_date, location, fuel_type]
      );

      console.log('Fleet record created successfully:', result);
      return { id, ...fleetData };
    } catch (error) {
      console.error('FleetManagement.create() error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vehicle ID or number already exists');
      }
      throw new Error(`Error creating fleet record: ${error.message}`);
    }
  }

  static async update(id, fleetData) {
    try {
      console.log('FleetManagement.update() called with:', id, fleetData);
      const {
        vehicle_number, vehicle_type, driver_name, driver_phone,
        capacity, status, last_maintenance_date, next_maintenance_date, location, fuel_type
      } = fleetData;

      const [result] = await promisePool.execute(
        `UPDATE fleet_management 
         SET vehicle_number = ?, vehicle_type = ?, driver_name = ?, driver_phone = ?, capacity = ?, status = ?, last_maintenance_date = ?, next_maintenance_date = ?, location = ?, fuel_type = ?
         WHERE id = ?`,
        [vehicle_number, vehicle_type, driver_name, driver_phone, capacity, status, last_maintenance_date, next_maintenance_date, location, fuel_type, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Fleet record not found');
      }

      console.log('Fleet record updated successfully:', result);
      return { id, ...fleetData };
    } catch (error) {
      console.error('FleetManagement.update() error:', error);
      throw new Error(`Error updating fleet record: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('FleetManagement.delete() called with id:', id);
      const [result] = await promisePool.execute(
        'DELETE FROM fleet_management WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Fleet record not found');
      }

      console.log('Fleet record deleted successfully');
      return { message: 'Fleet record deleted successfully' };
    } catch (error) {
      console.error('FleetManagement.delete() error:', error);
      throw new Error(`Error deleting fleet record: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const [totalRows] = await promisePool.execute(
        'SELECT COUNT(*) as total FROM fleet_management'
      );
      
      const [statusRows] = await promisePool.execute(
        'SELECT status, COUNT(*) as count FROM fleet_management GROUP BY status'
      );

      const [typeRows] = await promisePool.execute(
        'SELECT vehicle_type, COUNT(*) as count FROM fleet_management GROUP BY vehicle_type'
      );

      const [maintenanceRows] = await promisePool.execute(
        'SELECT COUNT(*) as due_maintenance FROM fleet_management WHERE next_maintenance_date <= CURDATE()'
      );

      return {
        total: totalRows[0].total,
        statusDistribution: statusRows,
        typeDistribution: typeRows,
        dueMaintenance: maintenanceRows[0].due_maintenance
      };
    } catch (error) {
      console.error('FleetManagement.getStats() error:', error);
      throw new Error(`Error fetching fleet stats: ${error.message}`);
    }
  }
}

module.exports = FleetManagement;
