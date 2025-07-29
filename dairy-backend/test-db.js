const mysql = require('mysql2');
require('dotenv').config();

async function testDatabase() {
  try {
    // Create connection
    const connection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dairy_management'
    });

    console.log('Testing database connection...');
    
    // Test connection
    connection.connect((err) => {
      if (err) {
        console.error('❌ Connection failed:', err.message);
        return;
      }
      console.log('✅ Connected to MySQL database');
      
      // Test farmers table
      connection.query('SELECT * FROM farmers', (err, results) => {
        if (err) {
          console.error('❌ Query failed:', err.message);
        } else {
          console.log('✅ Farmers table data:', results);
          console.log('📊 Number of farmers:', results.length);
        }
        
        // Test insert
        const testFarmer = {
          id: 'FARM9999',
          name: 'Test Farmer',
          phone: '9876543210',
          email: 'test@test.com',
          address: 'Test Address',
          cattle_count: 5,
          bank_account: '123456789012',
          ifsc_code: 'SBIN0001234',
          status: 'Active',
          join_date: '2025-06-30'
        };
        
        connection.query('INSERT INTO farmers SET ?', testFarmer, (err, result) => {
          if (err) {
            console.error('❌ Insert failed:', err.message);
          } else {
            console.log('✅ Test farmer inserted successfully');
            
            // Delete test farmer
            connection.query('DELETE FROM farmers WHERE id = ?', ['FARM9999'], (err) => {
              if (err) {
                console.error('❌ Delete failed:', err.message);
              } else {
                console.log('✅ Test farmer deleted successfully');
              }
              connection.end();
            });
          }
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

testDatabase();
