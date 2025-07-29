const Employee = require('../models/Employee');

exports.getAll = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json({ success: true, data: employees });
  } catch (err) {
    console.error('Controller error - getAll employees:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const employee = await Employee.getById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    console.error('Controller error - getById employee:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    console.error('Controller error - create employee:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const employee = await Employee.update(req.params.id, req.body);
    res.json({ success: true, data: employee });
  } catch (err) {
    console.error('Controller error - update employee:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Employee.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Controller error - delete employee:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
