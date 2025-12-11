const express = require('express');
const router = express.Router();
const annotationController = require('../controllers/annotationController');
const { protect } = require('../middleware/auth');
const { validateAnnotation, validateAnnotationUpdate, validateMongoId } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// Annotation CRUD
router.post('/', validateAnnotation, annotationController.createAnnotation);
router.get('/asset/:assetId', validateMongoId('assetId'), annotationController.getAnnotationsByAsset);
router.get('/user/me', annotationController.getMyAnnotations);
router.get('/:id', validateMongoId('id'), annotationController.getAnnotation);
router.put('/:id', validateAnnotationUpdate, annotationController.updateAnnotation);
router.delete('/:id', validateMongoId('id'), annotationController.deleteAnnotation);

module.exports = router;
