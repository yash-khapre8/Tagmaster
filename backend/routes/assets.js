const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { protect, requireAdmin } = require('../middleware/auth');
const { validateAsset, validateMongoId } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// Asset routes
router.get('/', assetController.getAllAssets); // Get all assets
router.get('/queue', assetController.getQueue); // Get available queue
router.get('/:id', validateMongoId('id'), assetController.getAsset);
router.patch('/:id/claim', validateMongoId('id'), assetController.claimAsset);
router.patch('/:id/release', validateMongoId('id'), assetController.releaseAsset);
router.patch('/:id/complete', validateMongoId('id'), assetController.completeAsset);

// Admin routes
router.post('/', requireAdmin, validateAsset, assetController.createAsset);
router.post('/release-stale', requireAdmin, assetController.releaseStale);

module.exports = router;
