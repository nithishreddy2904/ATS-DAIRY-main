const Payment = require('../models/Payment');

exports.getAll = async (req, res) => {
  try {
    const payments = await Payment.getAll();
    res.json({ success: true, data: payments });
  } catch (err) {
    console.error('Controller error - getAll payments:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const payment = await Payment.getById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (err) {
    console.error('Controller error - getById payment:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    console.error('Controller error - create payment:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payment = await Payment.update(req.params.id, req.body);
    res.json({ success: true, data: payment });
  } catch (err) {
    console.error('Controller error - update payment:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Payment.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete payment:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
