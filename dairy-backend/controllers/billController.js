const Bill = require('../models/Bill');

exports.getAll = async (req, res) => {
  try {
    const bills = await Bill.getAll();
    res.json({ success: true, data: bills });
  } catch (err) {
    console.error('Controller error - getAll bills:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const bill = await Bill.getById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.json({ success: true, data: bill });
  } catch (err) {
    console.error('Controller error - getById bill:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (err) {
    console.error('Controller error - create bill:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const bill = await Bill.update(req.params.id, req.body);
    res.json({ success: true, data: bill });
  } catch (err) {
    console.error('Controller error - update bill:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Bill.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.json({ success: true, message: 'Bill deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete bill:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
