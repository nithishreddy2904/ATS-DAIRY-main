const { promisePool } = require('../config/database');

const LabQualityTest = {
  getAll: async () => {
    try {
      console.log('🔄 Executing getAll query for lab_quality_tests');
      const [rows] = await promisePool.execute('SELECT * FROM lab_quality_tests ORDER BY test_date DESC');
      console.log('✅ Found', rows.length, 'lab quality tests');
      return rows;
    } catch (error) {
      console.error('❌ Error in LabQualityTest.getAll:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await promisePool.execute('SELECT * FROM lab_quality_tests WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('❌ Error in LabQualityTest.getById:', error);
      throw error;
    }
  },

  create: async (record) => {
    try {
      console.log('➕ Creating lab quality test with data:', record);
      
      // Validate required fields
      const requiredFields = ['batch_id', 'sample_id', 'farmer_id', 'test_date', 'tested_by'];
      const missingFields = requiredFields.filter(field => !record[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const [result] = await promisePool.execute(
        `INSERT INTO lab_quality_tests
        (batch_id, sample_id, farmer_id, test_date, test_type, fat_content, 
         protein_content, lactose_content, snf_content, ph_level, bacteria_count, 
         adulteration, overall_grade, status, remarks, tested_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.batch_id, record.sample_id, record.farmer_id, record.test_date, 
          record.test_type || 'Routine Test',
          record.fat_content, record.protein_content, record.lactose_content, 
          record.snf_content, record.ph_level, record.bacteria_count, 
          record.adulteration || 'None Detected', record.overall_grade || 'A+',
          record.status || 'Pending', record.remarks, record.tested_by
        ]
      );

      console.log('✅ Lab quality test created with ID:', result.insertId);
      return { id: result.insertId, ...record };
    } catch (error) {
      console.error('❌ Error in LabQualityTest.create:', error);
      throw error;
    }
  },

  update: async (id, record) => {
    try {
      console.log('✏️ Updating lab quality test ID:', id, 'with data:', record);
      
      await promisePool.execute(
        `UPDATE lab_quality_tests SET
        batch_id=?, sample_id=?, farmer_id=?, test_date=?, test_type=?, 
        fat_content=?, protein_content=?, lactose_content=?, snf_content=?, 
        ph_level=?, bacteria_count=?, adulteration=?, overall_grade=?, 
        status=?, remarks=?, tested_by=?
        WHERE id=?`,
        [
          record.batch_id, record.sample_id, record.farmer_id, record.test_date,
          record.test_type, record.fat_content, record.protein_content, 
          record.lactose_content, record.snf_content, record.ph_level, 
          record.bacteria_count, record.adulteration, record.overall_grade,
          record.status, record.remarks, record.tested_by, id
        ]
      );

      console.log('✅ Lab quality test updated successfully');
      return { id, ...record };
    } catch (error) {
      console.error('❌ Error in LabQualityTest.update:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('🗑️ Deleting lab quality test ID:', id);
      await promisePool.execute('DELETE FROM lab_quality_tests WHERE id = ?', [id]);
      console.log('✅ Lab quality test deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error in LabQualityTest.delete:', error);
      throw error;
    }
  }
};

module.exports = LabQualityTest;
