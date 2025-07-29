const { promisePool } = require('../config/database');

class Announcement {
    static async getAll() {
        const [rows] = await promisePool.execute('SELECT * FROM announcements ORDER BY publish_date DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await promisePool.execute('SELECT * FROM announcements WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { id, title, content, target_audience, priority, publish_date, status, views } = data;
        await promisePool.execute(
            `INSERT INTO announcements (id, title, content, target_audience, priority, publish_date, status, views)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, content, target_audience, priority, publish_date, status, views || 0]
        );
        return { ...data };
    }

    static async update(id, data) {
        const { title, content, target_audience, priority, publish_date, status, views } = data;
        const [result] = await promisePool.execute(
            `UPDATE announcements SET title=?, content=?, target_audience=?, priority=?, publish_date=?, status=?, views=?
             WHERE id=?`,
            [title, content, target_audience, priority, publish_date, status, views || 0, id]
        );
        if (result.affectedRows === 0) throw new Error('Announcement not found');
        return { id, ...data };
    }

    static async delete(id) {
        const [result] = await promisePool.execute('DELETE FROM announcements WHERE id = ?', [id]);
        if (result.affectedRows === 0) throw new Error('Announcement not found');
        return { message: 'Announcement deleted successfully' };
    }
}
module.exports = Announcement;
