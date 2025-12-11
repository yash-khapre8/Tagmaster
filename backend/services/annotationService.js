const Annotation = require('../models/Annotation');
const Asset = require('../models/Asset');
const User = require('../models/User');

// Create annotation
const createAnnotation = async (annotationData, userId) => {
    const { asset: assetId } = annotationData;

    // Verify asset exists and is claimed by user
    const asset = await Asset.findById(assetId);

    if (!asset) {
        const error = new Error('Asset not found');
        error.statusCode = 404;
        throw error;
    }

    if (asset.status !== 'claimed' || asset.claimedBy.toString() !== userId.toString()) {
        const error = new Error('You must claim this asset before annotating');
        error.statusCode = 403;
        throw error;
    }

    // Create annotation
    const annotation = await Annotation.create({
        ...annotationData,
        user: userId
    });

    // Update user stats
    await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.annotationsCreated': 1 }
    });

    return annotation.populate('user', 'name email');
};

// Get annotations for an asset
const getAnnotationsByAsset = async (assetId, includeDeleted = false) => {
    const query = { asset: assetId };

    if (!includeDeleted) {
        query.isDeleted = false;
    }

    const annotations = await Annotation.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    return annotations;
};

// Get annotation by ID
const getAnnotationById = async (annotationId) => {
    const annotation = await Annotation.findById(annotationId)
        .populate('user', 'name email')
        .populate('asset', 'title type');

    if (!annotation) {
        const error = new Error('Annotation not found');
        error.statusCode = 404;
        throw error;
    }

    return annotation;
};

// Update annotation with conflict detection
const updateAnnotation = async (annotationId, updates, userId, clientVersion) => {
    const annotation = await Annotation.findById(annotationId);

    if (!annotation) {
        const error = new Error('Annotation not found');
        error.statusCode = 404;
        throw error;
    }

    // Check if annotation is deleted
    if (annotation.isDeleted) {
        const error = new Error('Cannot update deleted annotation');
        error.statusCode = 400;
        throw error;
    }

    // Verify user has permission (asset must be claimed by user)
    const asset = await Asset.findById(annotation.asset);
    if (!asset || asset.status !== 'claimed' || asset.claimedBy.toString() !== userId.toString()) {
        const error = new Error('You do not have permission to update this annotation');
        error.statusCode = 403;
        throw error;
    }

    // Optimistic Concurrency Control - Check version
    if (clientVersion && annotation.version !== clientVersion) {
        const error = new Error('Annotation has been modified by another user');
        error.statusCode = 409; // Conflict
        error.conflict = true;
        error.currentVersion = annotation.version;
        error.currentData = annotation;
        throw error;
    }

    // Track changes for history
    const changes = {};
    Object.keys(updates).forEach(key => {
        if (JSON.stringify(annotation[key]) !== JSON.stringify(updates[key])) {
            changes[key] = {
                from: annotation[key],
                to: updates[key]
            };
        }
    });

    // Update annotation
    Object.assign(annotation, updates);
    annotation.version += 1; // Increment version
    annotation.lastModifiedBy = userId;

    // Add to history
    annotation.history.push({
        user: userId,
        action: 'updated',
        timestamp: new Date(),
        changes
    });

    await annotation.save();

    return annotation.populate('user lastModifiedBy', 'name email');
};

// Delete annotation (soft delete)
const deleteAnnotation = async (annotationId, userId, isAdmin = false) => {
    const annotation = await Annotation.findById(annotationId);

    if (!annotation) {
        const error = new Error('Annotation not found');
        error.statusCode = 404;
        throw error;
    }

    if (annotation.isDeleted) {
        const error = new Error('Annotation is already deleted');
        error.statusCode = 400;
        throw error;
    }

    // Check permission
    if (!isAdmin) {
        const asset = await Asset.findById(annotation.asset);

        if (!asset || asset.claimedBy.toString() !== userId.toString()) {
            const error = new Error('You do not have permission to delete this annotation');
            error.statusCode = 403;
            throw error;
        }
    }

    await annotation.softDelete(userId);

    return annotation;
};

// Get user's annotation history
const getUserAnnotations = async (userId, filters = {}) => {
    const query = { user: userId, isDeleted: false };

    if (filters.asset) {
        query.asset = filters.asset;
    }

    const annotations = await Annotation.find(query)
        .populate('asset', 'title type')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 100);

    return annotations;
};

module.exports = {
    createAnnotation,
    getAnnotationsByAsset,
    getAnnotationById,
    updateAnnotation,
    deleteAnnotation,
    getUserAnnotations
};
