const Review = require('../models/Review');
const { validationResult } = require('express-validator');

const reviewController = {
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.getAll();
      res.json({ success: true, data: reviews, message: 'Reviews fetched successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createReview: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }
      const review = await Review.create(req.body);
      res.status(201).json({ success: true, data: review, message: 'Review created successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.update(id, req.body);
      res.json({ success: true, data: review, message: 'Review updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      await Review.delete(id);
      res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = reviewController;
