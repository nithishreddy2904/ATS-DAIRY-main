const { promisePool } = require('../config/database');

class Audit {
    static async getAll() {
        try {
            console.log('Audit.getAll() called');
            const [rows] = await promisePool.execute(
                'SELECT * FROM audits ORDER BY created_at DESC'
            );
            console.log('Database returned:', rows.length, 'audits');
            return rows;
        } catch (error) {
            console.error('Audit.getAll() error:', error);
            throw new Error(`Error fetching audits: ${error.message}`);
        }
    }

    static async getById(id) {
        try {
            console.log('Audit.getById() called with id:', id);
            const [rows] = await promisePool.execute(
                'SELECT * FROM audits WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Audit.getById() error:', error);
            throw new Error(`Error fetching audit: ${error.message}`);
        }
    }

    static async create(auditData) {
        try {
            console.log('Audit.create() called with:', auditData);
            const {
                id, audit_type, auditor, audit_firm, scheduled_date, completed_date,
                duration, status, findings, corrective_actions, score, audit_scope,
                audit_criteria, non_conformities, recommendations, follow_up_date,
                cost, report_path
            } = auditData;

            const [result] = await promisePool.execute(
                `INSERT INTO audits 
                (id, audit_type, auditor, audit_firm, scheduled_date, completed_date, 
                 duration, status, findings, corrective_actions, score, audit_scope, 
                 audit_criteria, non_conformities, recommendations, follow_up_date, 
                 cost, report_path) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, audit_type, auditor, audit_firm, scheduled_date, completed_date,
                 duration, status, findings, corrective_actions, score, audit_scope,
                 audit_criteria, non_conformities, recommendations, follow_up_date,
                 cost, report_path]
            );

            console.log('Audit created successfully:', result);
            return { id, ...auditData };
        } catch (error) {
            console.error('Audit.create() error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Audit ID already exists');
            }
            throw new Error(`Error creating audit: ${error.message}`);
        }
    }

    static async update(id, auditData) {
        try {
            console.log('Audit.update() called with:', id, auditData);
            const {
                audit_type, auditor, audit_firm, scheduled_date, completed_date,
                duration, status, findings, corrective_actions, score, audit_scope,
                audit_criteria, non_conformities, recommendations, follow_up_date,
                cost, report_path
            } = auditData;

            const [result] = await promisePool.execute(
                `UPDATE audits 
                SET audit_type = ?, auditor = ?, audit_firm = ?, scheduled_date = ?, 
                    completed_date = ?, duration = ?, status = ?, findings = ?, 
                    corrective_actions = ?, score = ?, audit_scope = ?, audit_criteria = ?, 
                    non_conformities = ?, recommendations = ?, follow_up_date = ?, 
                    cost = ?, report_path = ? 
                WHERE id = ?`,
                [audit_type, auditor, audit_firm, scheduled_date, completed_date,
                 duration, status, findings, corrective_actions, score, audit_scope,
                 audit_criteria, non_conformities, recommendations, follow_up_date,
                 cost, report_path, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Audit not found');
            }

            console.log('Audit updated successfully:', result);
            return { id, ...auditData };
        } catch (error) {
            console.error('Audit.update() error:', error);
            throw new Error(`Error updating audit: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            console.log('Audit.delete() called with id:', id);
            const [result] = await promisePool.execute(
                'DELETE FROM audits WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Audit not found');
            }

            console.log('Audit deleted successfully');
            return { message: 'Audit deleted successfully' };
        } catch (error) {
            console.error('Audit.delete() error:', error);
            throw new Error(`Error deleting audit: ${error.message}`);
        }
    }
}

module.exports = Audit;
