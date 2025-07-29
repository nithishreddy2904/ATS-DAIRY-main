const Sale = require('../models/Sale');

exports.getAll = async (req, res) => {
  try {
    const sales = await Sale.getAll();
    res.json({ success: true, data: sales });
  } catch (err) {
    console.error('Controller error - getAll sales:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const sale = await Sale.getById(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, data: sale });
  } catch (err) {
    console.error('Controller error - getById sale:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    console.error('Controller error - create sale:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const sale = await Sale.update(req.params.id, req.body);
    res.json({ success: true, data: sale });
  } catch (err) {
    console.error('Controller error - update sale:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Sale.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, message: 'Sale deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete sale:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
