const bcrypt = require('bcryptjs');
const pool = require('../config/database'); // promise pool
const { promisePool } = require('../config/database');

class User {
  static async create({ id, name, email, password }) {
   try{ console.log('Creating user:', { id, name, email });
    const password_hash = await bcrypt.hash(password, 12);
    const resu=await promisePool.execute(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?,?,?,?)',
      [id, name, email, password_hash]
    );
    console.log('User created:', { id, name, email });
    return { id, name, email };

  } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User ID or email already exists');
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    const [rows] = await promisePool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async compare(pwd, hash) {
    return bcrypt.compare(pwd, hash);
  }
}


module.exports = User;
