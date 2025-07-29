const QualityControlRecord = require('../models/QualityControlRecord');

exports.getAll = async (req, res) => {
  try {
    const records = await QualityControlRecord.getAll();
    res.json({ success: true, data: records });
  } catch (err) {
    console.error('Controller error - getAll:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await QualityControlRecord.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Quality control record not found' });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - getById:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const record = await QualityControlRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - create:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await QualityControlRecord.update(req.params.id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - update:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await QualityControlRecord.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Quality control record not found' });
    }
    res.json({ success: true, message: 'Quality control record deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
