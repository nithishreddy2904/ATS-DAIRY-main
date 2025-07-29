const { promisePool } = require('../config/database');

class Document {
    static async getAll() {
        try {
            console.log('Document.getAll() called');
            const [rows] = await promisePool.execute(
                'SELECT * FROM documents ORDER BY created_at DESC'
            );
            console.log('Database returned:', rows.length, 'documents');
            return rows;
        } catch (error) {
            console.error('Document.getAll() error:', error);
            throw new Error(`Error fetching documents: ${error.message}`);
        }
    }

    static async getById(id) {
        try {
            console.log('Document.getById() called with id:', id);
            const [rows] = await promisePool.execute(
                'SELECT * FROM documents WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Document.getById() error:', error);
            throw new Error(`Error fetching document: ${error.message}`);
        }
    }

    static async create(documentData) {
        try {
            console.log('Document.create() called with:', documentData);
            const {
                id, name, type, category, upload_date, expiry_date, status,
                size, version, uploaded_by, reviewed_by, approved_by, file_path, description
            } = documentData;

            const [result] = await promisePool.execute(
                `INSERT INTO documents 
                (id, name, type, category, upload_date, expiry_date, status, 
                 size, version, uploaded_by, reviewed_by, approved_by, file_path, description) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, name, type, category, upload_date, expiry_date, status,
                 size, version, uploaded_by, reviewed_by, approved_by, file_path, description]
            );

            console.log('Document created successfully:', result);
            return { id, ...documentData };
        } catch (error) {
            console.error('Document.create() error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Document ID already exists');
            }
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

    static async update(id, documentData) {
        try {
            console.log('Document.update() called with:', id, documentData);
            const {
                name, type, category, upload_date, expiry_date, status,
                size, version, uploaded_by, reviewed_by, approved_by, file_path, description
            } = documentData;

            const [result] = await promisePool.execute(
                `UPDATE documents 
                SET name = ?, type = ?, category = ?, upload_date = ?, expiry_date = ?, 
                    status = ?, size = ?, version = ?, uploaded_by = ?, reviewed_by = ?, 
                    approved_by = ?, file_path = ?, description = ? 
                WHERE id = ?`,
                [name, type, category, upload_date, expiry_date, status,
                 size, version, uploaded_by, reviewed_by, approved_by, file_path, description, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Document not found');
            }

            console.log('Document updated successfully:', result);
            return { id, ...documentData };
        } catch (error) {
            console.error('Document.update() error:', error);
            throw new Error(`Error updating document: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            console.log('Document.delete() called with id:', id);
            const [result] = await promisePool.execute(
                'DELETE FROM documents WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Document not found');
            }

            console.log('Document deleted successfully');
            return { message: 'Document deleted successfully' };
        } catch (error) {
            console.error('Document.delete() error:', error);
            throw new Error(`Error deleting document: ${error.message}`);
        }
    }
}

module.exports = Document;
