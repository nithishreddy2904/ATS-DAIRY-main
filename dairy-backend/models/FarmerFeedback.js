const { promisePool } = require('../config/database');

class FarmerFeedback {
    static async getAll() {
        try {
            console.log('FarmerFeedback.getAll() called');
            const [rows] = await promisePool.execute(
                'SELECT * FROM farmer_feedback ORDER BY created_at DESC'
            );
            console.log('Database returned:', rows.length, 'farmer feedback records');
            return rows;
        } catch (error) {
            console.error('FarmerFeedback.getAll() error:', error);
            throw new Error(`Error fetching farmer feedback: ${error.message}`);
        }
    }

    static async getById(id) {
        try {
            console.log('FarmerFeedback.getById() called with id:', id);
            const [rows] = await promisePool.execute(
                'SELECT * FROM farmer_feedback WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('FarmerFeedback.getById() error:', error);
            throw new Error(`Error fetching farmer feedback: ${error.message}`);
        }
    }

    static async create(feedbackData) {
        try {
            console.log('FarmerFeedback.create() called with:', feedbackData);
            const {
                id, farmer_name, farmer_id, feedback_type, rating,
                message, date, priority, status
            } = feedbackData;

            const [result] = await promisePool.execute(
                `INSERT INTO farmer_feedback
                (id, farmer_name, farmer_id, feedback_type, rating, message, date, priority, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, farmer_name, farmer_id, feedback_type, rating, message, date, priority, status]
            );

            console.log('Farmer feedback created successfully:', result);
            return { id, ...feedbackData };
        } catch (error) {
            console.error('FarmerFeedback.create() error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Farmer feedback ID already exists');
            }
            throw new Error(`Error creating farmer feedback: ${error.message}`);
        }
    }

    static async update(id, feedbackData) {
        try {
            console.log('FarmerFeedback.update() called with:', id, feedbackData);
            const {
                farmer_name, farmer_id, feedback_type, rating,
                message, date, priority, status
            } = feedbackData;

            const [result] = await promisePool.execute(
                `UPDATE farmer_feedback
                SET farmer_name = ?, farmer_id = ?, feedback_type = ?, rating = ?,
                    message = ?, date = ?, priority = ?, status = ?
                WHERE id = ?`,
                [farmer_name, farmer_id, feedback_type, rating, message, date, priority, status, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Farmer feedback not found');
            }

            console.log('Farmer feedback updated successfully:', result);
            return { id, ...feedbackData };
        } catch (error) {
            console.error('FarmerFeedback.update() error:', error);
            throw new Error(`Error updating farmer feedback: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            console.log('FarmerFeedback.delete() called with id:', id);
            const [result] = await promisePool.execute(
                'DELETE FROM farmer_feedback WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Farmer feedback not found');
            }

            console.log('Farmer feedback deleted successfully');
            return { message: 'Farmer feedback deleted successfully' };
        } catch (error) {
            console.error('FarmerFeedback.delete() error:', error);
            throw new Error(`Error deleting farmer feedback: ${error.message}`);
        }
    }
}

module.exports = FarmerFeedback;
