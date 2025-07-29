const Retailer = require('../models/Retailer');

exports.getAll = async (req, res) => {
  try {
    const retailers = await Retailer.getAll();
    res.json({ success: true, data: retailers });
  } catch (err) {
    console.error('Controller error - getAll retailers:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const retailer = await Retailer.getById(req.params.id);
    if (!retailer) {
      return res.status(404).json({ success: false, message: 'Retailer not found' });
    }
    res.json({ success: true, data: retailer });
  } catch (err) {
    console.error('Controller error - getById retailer:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const retailer = await Retailer.create(req.body);
    res.status(201).json({ success: true, data: retailer });
  } catch (err) {
    console.error('Controller error - create retailer:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const retailer = await Retailer.update(req.params.id, req.body);
    res.json({ success: true, data: retailer });
  } catch (err) {
    console.error('Controller error - update retailer:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Retailer.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Retailer not found' });
    }
    res.json({ success: true, message: 'Retailer deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete retailer:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
