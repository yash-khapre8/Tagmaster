const { body, param, validationResult } = require('express-validator');

// Validation result checker
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('role')
        .optional()
        .isIn(['annotator', 'manager', 'admin'])
        .withMessage('Invalid role'),
    validate
];

// Login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];

// Asset creation validation
const validateAsset = [
    body('type')
        .isIn(['image', 'text'])
        .withMessage('Type must be either image or text'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title must not exceed 200 characters'),
    body('project')
        .trim()
        .notEmpty()
        .withMessage('Project is required'),
    body('url')
        .if(body('type').equals('image'))
        .notEmpty()
        .withMessage('URL is required for image assets')
        .isURL()
        .withMessage('Please provide a valid URL'),
    body('content')
        .if(body('type').equals('text'))
        .notEmpty()
        .withMessage('Content is required for text assets'),
    validate
];

// Annotation creation validation
const validateAnnotation = [
    body('asset')
        .notEmpty()
        .withMessage('Asset ID is required')
        .isMongoId()
        .withMessage('Invalid asset ID'),
    body('type')
        .isIn(['bounding_box', 'text_label', 'polygon', 'point'])
        .withMessage('Invalid annotation type'),
    body('label')
        .trim()
        .notEmpty()
        .withMessage('Label is required')
        .isLength({ max: 100 })
        .withMessage('Label must not exceed 100 characters'),
    body('geometry')
        .if(body('type').equals('bounding_box'))
        .notEmpty()
        .withMessage('Geometry is required for bounding box annotations'),
    validate
];

// Annotation update validation
const validateAnnotationUpdate = [
    param('id')
        .isMongoId()
        .withMessage('Invalid annotation ID'),
    body('label')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Label must not exceed 100 characters'),
    validate
];

// MongoDB ID validation
const validateMongoId = (paramName = 'id') => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName}`),
    validate
];

module.exports = {
    validate,
    validateRegister,
    validateLogin,
    validateAsset,
    validateAnnotation,
    validateAnnotationUpdate,
    validateMongoId
};
