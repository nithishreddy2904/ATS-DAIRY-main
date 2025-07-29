const Delivery = require('../models/Delivery');

exports.getAllDeliveries = async (req, res) => {
  try { 
    const deliveries = await Delivery.getAll();
    res.json({ success: true, data: deliveries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.getById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const {
      delivery_date, vehicle_id, driver_name, destination, status,
      priority, estimatedTime, distance
    } = req.body;
    await Delivery.create({
      delivery_date, vehicle_id, driver_name, destination, status,
      priority, estimatedTime, distance
    });
    res.json({ success: true, message: 'Delivery created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      delivery_date, vehicle_id, driver_name, destination, status,
      priority, estimatedTime, distance
    } = req.body;
    await Delivery.update(id, {
      delivery_date, vehicle_id, driver_name, destination, status,
      priority, estimatedTime, distance
    });
    res.json({ success: true, message: 'Delivery updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    await Delivery.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
