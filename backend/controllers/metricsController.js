const metricsService = require('../services/metricsService');

// @desc    Get user metrics
// @route   GET /api/metrics/user/:userId
const getUserMetrics = async (req, res, next) => {
    try {
        // Users can only view their own metrics unless they're a manager
        const requestedUserId = req.params.userId;

        if (req.user.role !== 'manager' && req.user.role !== 'admin'
            && requestedUserId !== req.user._id.toString()) {
            const error = new Error('You can only view your own metrics');
            error.statusCode = 403;
            throw error;
        }

        const metrics = await metricsService.getUserMetrics(requestedUserId);

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my metrics
// @route   GET /api/metrics/me
const getMyMetrics = async (req, res, next) => {
    try {
        const metrics = await metricsService.getUserMetrics(req.user._id);

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard metrics (manager/admin only)
// @route   GET /api/metrics/dashboard
const getDashboard = async (req, res, next) => {
    try {
        const metrics = await metricsService.getDashboardMetrics();

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get project metrics (manager/admin only)
// @route   GET /api/metrics/project/:projectName
const getProjectMetrics = async (req, res, next) => {
    try {
        const metrics = await metricsService.getProjectMetrics(req.params.projectName);

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserMetrics,
    getMyMetrics,
    getDashboard,
    getProjectMetrics
};
