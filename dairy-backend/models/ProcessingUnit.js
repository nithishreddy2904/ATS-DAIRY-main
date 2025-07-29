const { promisePool } = require('../config/database');

exports.getAll = () =>
  promisePool.execute('SELECT * FROM processing_units');

exports.create = (unit) =>
  promisePool.execute(
    'INSERT INTO processing_units (unit_id, name, location, capacity, manager, contact, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [unit.unit_id, unit.name, unit.location, unit.capacity, unit.manager, unit.contact, unit.status, unit.type]
  );

exports.update = (id, unit) =>
  promisePool.execute(
    'UPDATE processing_units SET unit_id=?, name=?, location=?, capacity=?, manager=?, contact=?, status=?, type=? WHERE id=?',
    [unit.unit_id, unit.name, unit.location, unit.capacity, unit.manager, unit.contact, unit.status, unit.type, id]
  );

exports.delete = (id) =>
  promisePool.execute('DELETE FROM processing_units WHERE id=?', [id]);