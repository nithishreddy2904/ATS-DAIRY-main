const { promisePool } = require('../config/database');

class Delivery {
  static async getAll() {
    console.log('Delivery.getAll() called');
    const [rows] = await promisePool.query(
      `SELECT d.*, f.vehicle_number 
       FROM deliveries d 
       LEFT JOIN fleet_management f ON d.vehicle_id = f.id
       ORDER BY d.delivery_date DESC`
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await promisePool.query(
      `SELECT * FROM deliveries WHERE id = ?`, [id]
    );
    return rows[0];
  }

  static async create(data) {
    const { delivery_date, vehicle_id, driver_name, destination, status, notes, priority, estimatedTime, distance } = data;
    const [result] = await promisePool.query(
      `INSERT INTO deliveries (delivery_date, vehicle_id, driver_name, destination, status, notes, priority, estimatedTime, distance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [delivery_date, vehicle_id, driver_name, destination, status, notes, priority, estimatedTime, distance]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { delivery_date, vehicle_id, driver_name, destination, status, notes, priority, estimatedTime, distance } = data;
    await promisePool.query(
      `UPDATE deliveries SET delivery_date=?, vehicle_id=?, driver_name=?, destination=?, status=?, notes=?, priority=?, estimatedTime=?, distance=?
       WHERE id=?`,
      [delivery_date, vehicle_id, driver_name, destination, status, notes, priority, estimatedTime, distance, id]
    );
    return { id, ...data };
  }

  static async delete(id) {
    await promisePool.query(`DELETE FROM deliveries WHERE id=?`, [id]);
    return true;
  }
}

module.exports = Delivery;
