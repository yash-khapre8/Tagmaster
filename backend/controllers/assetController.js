const assetService = require('../services/assetService');

// @desc    Get all assets
// @route   GET /api/assets
const getAllAssets = async (req, res, next) => {
    try {
        const { project, type, status } = req.query;

        const assets = await assetService.getAllAssets({
            project,
            type,
            status
        });

        res.json({
            success: true,
            count: assets.length,
            data: assets
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get asset queue (available only)
// @route   GET /api/assets/queue
const getQueue = async (req, res, next) => {
    try {
        const { project, type, limit } = req.query;

        const assets = await assetService.getAssetQueue({
            project,
            type,
            limit: parseInt(limit) || 50
        });

        res.json({
            success: true,
            count: assets.length,
            data: assets
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Claim an asset
// @route   POST /api/assets/:id/claim
const claimAsset = async (req, res, next) => {
    try {
        const result = await assetService.claimAsset(req.params.id, req.user._id);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Release an asset
// @route   POST /api/assets/:id/release
const releaseAsset = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const asset = await assetService.releaseAsset(req.params.id, req.user._id, isAdmin);

        res.json({
            success: true,
            data: asset
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Complete an asset
// @route   POST /api/assets/:id/complete
const completeAsset = async (req, res, next) => {
    try {
        const asset = await assetService.completeAsset(req.params.id, req.user._id);

        res.json({
            success: true,
            data: asset
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get asset by ID
// @route   GET /api/assets/:id
const getAsset = async (req, res, next) => {
    try {
        const asset = await assetService.getAssetById(req.params.id);

        res.json({
            success: true,
            data: asset
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new asset (admin only)
// @route   POST /api/assets
const createAsset = async (req, res, next) => {
    try {
        const asset = await assetService.createAsset(req.body);

        res.status(201).json({
            success: true,
            data: asset
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Release stale assets
// @route   POST /api/assets/release-stale
const releaseStale = async (req, res, next) => {
    try {
        const released = await assetService.releaseStaleAssets();

        res.json({
            success: true,
            message: `Released ${released.length} stale assets`,
            data: released
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAssets,
    getQueue,
    claimAsset,
    releaseAsset,
    completeAsset,
    getAsset,
    createAsset,
    releaseStale
};
