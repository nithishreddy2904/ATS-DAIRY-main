const { promisePool } = require('../config/database');

class Review {
  static async getAll() {
    const [rows] = await promisePool.execute('SELECT * FROM reviews ORDER BY created_at DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await promisePool.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows[0];
  }
 
  static async create(reviewData) {
    const {
      id, customer_name, customer_email, category, rating,
      subject, comment, date, status, response, response_date
    } = reviewData;
    await promisePool.execute(
      `INSERT INTO reviews
      (id, customer_name, customer_email, category, rating, subject, comment, date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, customer_name, customer_email, category, rating, subject, comment, date, status]
    );
    return { id, ...reviewData };
  }

  static async update(id, reviewData) {
    const {
      customer_name, customer_email, category, rating,
      subject, comment, status, response, response_date
    } = reviewData;
    const [result] = await promisePool.execute(
      `UPDATE reviews SET customer_name=?, customer_email=?, category=?, rating=?, subject=?, comment=?, status=?, response=?, response_date=?
       WHERE id=?`,
      [customer_name, customer_email, category, rating, subject, comment, status, response, response_date, id]
    );
    if (result.affectedRows === 0) throw new Error('Review not found');
    return { id, ...reviewData };
  }

  static async delete(id) {
    const [result] = await promisePool.execute('DELETE FROM reviews WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new Error('Review not found');
    return { message: 'Review deleted successfully' };
  }
}

module.exports = Review;
