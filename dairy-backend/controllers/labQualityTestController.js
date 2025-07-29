const LabQualityTest = require('../models/LabQualityTest');

exports.getAll = async (req, res) => {
  try {
    console.log('🔄 Controller: Fetching all lab quality tests...');
    const records = await LabQualityTest.getAll();
    console.log('📋 Controller: Found', records.length, 'lab quality tests');
    res.json({ success: true, data: records });
  } catch (err) {
    console.error('❌ Controller Error fetching lab quality tests:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch lab quality tests', 
      error: err.message 
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await LabQualityTest.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Lab quality test not found' });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('❌ Controller Error fetching lab quality test:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch lab quality test', 
      error: err.message 
    });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('🔄 Controller: Creating lab quality test:', req.body);
    
    // Validate required fields
    const requiredFields = ['batch_id', 'sample_id', 'farmer_id', 'test_date', 'tested_by'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ' + missingFields.join(', ')
      });
    }

    const record = await LabQualityTest.create(req.body);
    console.log('✅ Controller: Lab quality test created successfully:', record);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('❌ Controller Error creating lab quality test:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create lab quality test', 
      error: err.message 
    });
  }
};

exports.update = async (req, res) => {
  try {
    console.log('✏️ Controller: Updating lab quality test ID:', req.params.id);
    const record = await LabQualityTest.update(req.params.id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('❌ Controller Error updating lab quality test:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update lab quality test', 
      error: err.message 
    });
  }
};

exports.delete = async (req, res) => {
  try {
    console.log('🗑️ Controller: Deleting lab quality test ID:', req.params.id);
    await LabQualityTest.delete(req.params.id);
    res.json({ success: true, message: 'Lab quality test deleted successfully' });
  } catch (err) {
    console.error('❌ Controller Error deleting lab quality test:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete lab quality test', 
      error: err.message 
    });
  }
};
