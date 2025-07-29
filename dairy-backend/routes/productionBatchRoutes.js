const express = require('express');
const router = express.Router();
const controller = require('../controllers/productionBatchController');

router.get('/', controller.getAllBatches);
router.post('/', controller.createBatches);
router.put('/:id', controller.updateBatch);
router.delete('/:id', controller.deleteBatch);

module.exports = router;