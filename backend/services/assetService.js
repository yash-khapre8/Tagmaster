const Asset = require('../models/Asset');
const Task = require('../models/Task');

// Get all assets with optional filters
const getAllAssets = async (filters = {}) => {
    const query = {};

    if (filters.project) {
        query.project = filters.project;
    }

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    const assets = await Asset.find(query)
        .populate('claimedBy', 'name email')
        .populate('completedBy', 'name email')
        .sort({ createdAt: -1 });

    return assets;
};

// Get available assets queue
const getAssetQueue = async (filters = {}) => {
    const query = { status: 'available' };

    if (filters.project) {
        query.project = filters.project;
    }

    if (filters.type) {
        query.type = filters.type;
    }

    const assets = await Asset.find(query)
        .sort({ priority: -1, createdAt: 1 })
        .limit(filters.limit || 50);

    return assets;
};

// Claim an asset
const claimAsset = async (assetId, userId) => {
    // Use findOneAndUpdate with conditions to prevent race conditions
    const asset = await Asset.findOneAndUpdate(
        {
            _id: assetId,
            status: 'available'
        },
        {
            status: 'claimed',
            claimedBy: userId,
            claimedAt: new Date()
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!asset) {
        // Asset is either not found or already claimed
        const existingAsset = await Asset.findById(assetId);

        if (!existingAsset) {
            const error = new Error('Asset not found');
            error.statusCode = 404;
            throw error;
        }

        const error = new Error('Asset is already claimed or completed');
        error.statusCode = 409; // Conflict
        throw error;
    }

    // Create a task for this assignment
    const task = await Task.create({
        asset: assetId,
        user: userId,
        status: 'in_progress',
        startedAt: new Date()
    });

    return { asset, task };
};

// Release an asset
const releaseAsset = async (assetId, userId, isAdmin = false) => {
    const asset = await Asset.findById(assetId);

    if (!asset) {
        const error = new Error('Asset not found');
        error.statusCode = 404;
        throw error;
    }

    // Check if user has permission to release
    if (!isAdmin && asset.claimedBy && asset.claimedBy.toString() !== userId.toString()) {
        const error = new Error('You do not have permission to release this asset');
        error.statusCode = 403;
        throw error;
    }

    if (asset.status !== 'claimed') {
        const error = new Error('Asset is not currently claimed');
        error.statusCode = 400;
        throw error;
    }

    // Release the asset
    await asset.release();

    // Find and abandon the task
    const task = await Task.findOne({
        asset: assetId,
        user: userId,
        status: 'in_progress'
    });

    if (task) {
        await task.abandon();
    }

    return asset;
};

// Complete an asset
const completeAsset = async (assetId, userId) => {
    const asset = await Asset.findById(assetId);

    if (!asset) {
        const error = new Error('Asset not found');
        error.statusCode = 404;
        throw error;
    }

    // Check ownership
    if (asset.claimedBy.toString() !== userId.toString()) {
        const error = new Error('You do not have permission to complete this asset');
        error.statusCode = 403;
        throw error;
    }

    asset.status = 'completed';
    asset.completedBy = userId;
    asset.completedAt = new Date();
    await asset.save();

    // Complete the task
    const task = await Task.findOne({
        asset: assetId,
        user: userId,
        status: 'in_progress'
    });

    if (task) {
        await task.complete();
    }

    return asset;
};

// Get asset by ID
const getAssetById = async (assetId) => {
    const asset = await Asset.findById(assetId)
        .populate('claimedBy', 'name email')
        .populate('completedBy', 'name email');

    if (!asset) {
        const error = new Error('Asset not found');
        error.statusCode = 404;
        throw error;
    }

    return asset;
};

// Create new asset (admin only)
const createAsset = async (assetData) => {
    const asset = await Asset.create(assetData);
    return asset;
};

// Check and release stale assets
const releaseStaleAssets = async () => {
    const assets = await Asset.find({ status: 'claimed' });
    const released = [];

    for (const asset of assets) {
        if (asset.isStale()) {
            await asset.release();

            // Abandon associated task
            const task = await Task.findOne({
                asset: asset._id,
                status: 'in_progress'
            });

            if (task) {
                await task.abandon();
            }

            released.push(asset._id);
        }
    }

    return released;
};

module.exports = {
    getAllAssets,
    getAssetQueue,
    claimAsset,
    releaseAsset,
    completeAsset,
    getAssetById,
    createAsset,
    releaseStaleAssets
};
