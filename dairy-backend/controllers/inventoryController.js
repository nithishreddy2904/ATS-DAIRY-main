const InventoryRecord = require('../models/InventoryRecord');

exports.getAll = async (req, res) => {
  try {
    const records = await InventoryRecord.getAll();
    res.json({ success: true, data: records });
  } catch (err) {
    console.error('Controller error - getAll inventory:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await InventoryRecord.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Inventory record not found' });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - getById inventory:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const record = await InventoryRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - create inventory:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await InventoryRecord.update(req.params.id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('Controller error - update inventory:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await InventoryRecord.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inventory record not found' });
    }
    res.json({ success: true, message: 'Inventory record deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete inventory:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
