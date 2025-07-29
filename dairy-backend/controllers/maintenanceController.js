const MaintenanceRecord = require('../models/MaintenanceRecord');

exports.getAll = async (req, res) => {
  try {
    const records = await MaintenanceRecord.getAll();
    res.json({ success: true, data: records });
  } catch (err) {
    console.error('Controller error - getAll:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await MaintenanceRecord.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - getById:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const record = await MaintenanceRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - create:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await MaintenanceRecord.update(req.params.id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - update:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await MaintenanceRecord.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
