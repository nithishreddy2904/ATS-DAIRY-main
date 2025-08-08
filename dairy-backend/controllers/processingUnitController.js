const { promisePool } = require('../config/database');

exports.getAllUnits = async (req, res) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM processing_units ORDER BY created_at DESC');
    const formattedUnits = rows.map((unit) => ({
      id: unit.id,
      unit_id: unit.unit_id,
      name: unit.name,
      location: unit.location,
      capacity: unit.capacity,
      manager: unit.manager,
      contact: unit.contact,
      status: unit.status,
      type: unit.type,
    }));
    res.json({ success: true, data: formattedUnits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUnit = async (req, res) => {
  try {
    const { unit_id, name, location, capacity, manager, contact, status, type } = req.body;
    const [result] = await promisePool.execute(
      'INSERT INTO processing_units (unit_id, name, location, capacity, manager, contact, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [unit_id, name, location, capacity, manager, contact, status || 'Active', type]
    );
    const newUnit = {
      id: result.insertId,
      unit_id,
      name,
      location,
      capacity,
      manager,
      contact,
      status: status || 'Active',
      type,
    };

    // Emit via socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('processing-unit:created', { action: 'create', data: newUnit });
    }

    res.json({ success: true, data: newUnit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_id, name, location, capacity, manager, contact, status, type } = req.body;

    const [result] = await promisePool.execute(
      'UPDATE processing_units SET unit_id=?, name=?, location=?, capacity=?, manager=?, contact=?, status=?, type=? WHERE id=?',
      [unit_id, name, location, capacity, manager, contact, status, type, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Processing unit not found' });
    }

    const updatedUnit = { id, unit_id, name, location, capacity, manager, contact, status, type };

    // Emit via socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('processing-unit:updated', { action: 'update', data: updatedUnit });
    }

    res.json({ success: true, data: updatedUnit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute('DELETE FROM processing_units WHERE id=?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Processing unit not found' });
    }

    // Emit via socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('processing-unit:deleted', { action: 'delete', data: { id } });
    }

    res.json({ success: true, message: 'Processing unit deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
