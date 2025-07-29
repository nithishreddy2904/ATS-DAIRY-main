const Announcement = require('../models/Announcement');
const { validationResult } = require('express-validator');

const announcementController = {
    getAllAnnouncements: async (req, res) => {
        try {
            const announcements = await Announcement.getAll();
            res.json({ success: true, data: announcements });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    createAnnouncement: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
            }
            const announcement = await Announcement.create(req.body);
            res.status(201).json({ success: true, data: announcement, message: 'Announcement created successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    updateAnnouncement: async (req, res) => {
        try {
            const { id } = req.params;
            const announcement = await Announcement.update(id, req.body);
            res.json({ success: true, data: announcement, message: 'Announcement updated successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    deleteAnnouncement: async (req, res) => {
        try {
            const { id } = req.params;
            await Announcement.delete(id);
            res.json({ success: true, message: 'Announcement deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
module.exports = announcementController;
