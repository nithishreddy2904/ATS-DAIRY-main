const ProductionBatch = require('../models/ProductionBatch');

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await ProductionBatch.getAll();
    res.json({ success: true, data: batches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBatches = async (req, res) => {
  try {
    const batch = await ProductionBatch.create(req.body);
    res.json({ success: true, data: batch });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await ProductionBatch.update(id, req.body);
    res.json({ success: true, data: batch });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductionBatch.delete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};