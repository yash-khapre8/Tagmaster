const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const { protect, requireManager } = require('../middleware/auth');
const { validateMongoId } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// User metrics
router.get('/me', metricsController.getMyMetrics);
router.get('/user/:userId', validateMongoId('userId'), metricsController.getUserMetrics);

// Manager/Admin only
router.get('/dashboard', requireManager, metricsController.getDashboard);
router.get('/project/:projectName', requireManager, metricsController.getProjectMetrics);

module.exports = router;
