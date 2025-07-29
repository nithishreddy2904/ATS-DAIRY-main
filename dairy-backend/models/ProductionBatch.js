const { promisePool } = require('../config/database');

class ProductionBatch {
  static async getAll() {
    const [rows] = await promisePool.execute(`
      SELECT pb.*, pu.name as unit_name, pu.unit_id as unit_identifier
      FROM production_batches pb
      LEFT JOIN processing_units pu ON pb.unit = pu.unit_id
      ORDER BY pb.date DESC
    `);
    
    // Format the response to match frontend expectations
    return rows.map(batch => ({
      id: batch.id,
      batchId: batch.batch_id,      // Map batch_id to batchId
      unit: batch.unit,             // Unit identifier
      unitId: batch.unit,           // For backward compatibility
      unitName: batch.unit_name,    // Unit name for display
      product: batch.product,
      quantity: batch.quantity,
      date: batch.date,
      status: batch.status,
      quality: batch.quality
    }));
  }

  static async create(data) {
    console.log('Creating production batch with data:', data);
    const { batch_id, unit, product, quantity, date, status, quality } = data;
    
    const [result] = await promisePool.execute(
      `INSERT INTO production_batches (batch_id, unit, product, quantity, date, status, quality)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [batch_id, unit, product, quantity, date, status, quality]
    );
    
    return { 
      id: result.insertId, 
      batchId: batch_id,
      unit,
      unitId: unit,
      product,
      quantity,
      date,
      status,
      quality
    };
  }

  static async update(id, data) {
    const { batch_id, unit, product, quantity, date, status, quality } = data;
    
    await promisePool.execute(
      `UPDATE production_batches SET batch_id=?, unit=?, product=?, quantity=?, date=?, status=?, quality=?
       WHERE id=?`,
      [batch_id, unit, product, quantity, date, status, quality, id]
    );
    
    return { 
      id, 
      batchId: batch_id,
      unit,
      unitId: unit,
      product,
      quantity,
      date,
      status,
      quality
    };
  }

  static async delete(id) {
    const [result] = await promisePool.execute('DELETE FROM production_batches WHERE id=?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProductionBatch;
