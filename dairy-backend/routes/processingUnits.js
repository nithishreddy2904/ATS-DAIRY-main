const express = require('express');
const router = express.Router();
const processingUnitController = require('../controllers/processingUnitController');

router.get('/', processingUnitController.getAllUnits);
router.post('/', processingUnitController.createUnit);
router.put('/:id', processingUnitController.updateUnit);
router.delete('/:id', processingUnitController.deleteUnit);

module.exports = router;