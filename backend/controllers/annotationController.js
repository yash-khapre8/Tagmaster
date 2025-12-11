const annotationService = require('../services/annotationService');

// @desc    Create annotation
// @route   POST /api/annotations
const createAnnotation = async (req, res, next) => {
    try {
        const annotation = await annotationService.createAnnotation(req.body, req.user._id);

        res.status(201).json({
            success: true,
            data: annotation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get annotations for an asset
// @route   GET /api/annotations/asset/:assetId
const getAnnotationsByAsset = async (req, res, next) => {
    try {
        const includeDeleted = req.query.includeDeleted === 'true';
        const annotations = await annotationService.getAnnotationsByAsset(
            req.params.assetId,
            includeDeleted
        );

        res.json({
            success: true,
            count: annotations.length,
            data: annotations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get annotation by ID
// @route   GET /api/annotations/:id
const getAnnotation = async (req, res, next) => {
    try {
        const annotation = await annotationService.getAnnotationById(req.params.id);

        res.json({
            success: true,
            data: annotation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update annotation
// @route   PUT /api/annotations/:id
const updateAnnotation = async (req, res, next) => {
    try {
        const { version: clientVersion, ...updates } = req.body;

        const annotation = await annotationService.updateAnnotation(
            req.params.id,
            updates,
            req.user._id,
            clientVersion
        );

        res.json({
            success: true,
            data: annotation
        });
    } catch (error) {
        // Handle conflict errors specially
        if (error.conflict) {
            return res.status(409).json({
                success: false,
                error: error.message,
                conflict: true,
                currentVersion: error.currentVersion,
                currentData: error.currentData
            });
        }
        next(error);
    }
};

// @desc    Delete annotation
// @route   DELETE /api/annotations/:id
const deleteAnnotation = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const annotation = await annotationService.deleteAnnotation(
            req.params.id,
            req.user._id,
            isAdmin
        );

        res.json({
            success: true,
            message: 'Annotation deleted successfully',
            data: annotation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's annotations
// @route   GET /api/annotations/user/me
const getMyAnnotations = async (req, res, next) => {
    try {
        const { asset, limit } = req.query;
        const annotations = await annotationService.getUserAnnotations(req.user._id, {
            asset,
            limit: parseInt(limit) || 100
        });

        res.json({
            success: true,
            count: annotations.length,
            data: annotations
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAnnotation,
    getAnnotationsByAsset,
    getAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getMyAnnotations
};
