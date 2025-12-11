const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['bounding_box', 'text_label', 'polygon', 'point'],
        required: true
    },
    label: {
        type: String,
        required: true,
        trim: true
    },
    // Bounding box coordinates (for image annotations)
    geometry: {
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        // For polygons or complex shapes
        points: [{
            x: Number,
            y: Number
        }]
    },
    // Text-specific annotations
    textRange: {
        start: Number,
        end: Number
    },
    // Additional properties
    properties: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 1
    },
    notes: {
        type: String,
        trim: true
    },
    // Version control for conflict resolution
    version: {
        type: Number,
        default: 1,
        required: true
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Multi-user history
    history: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        action: {
            type: String,
            enum: ['created', 'updated', 'deleted', 'verified'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        changes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    optimisticConcurrency: true // Enable built-in version key
});

// Compound indexes for efficient queries
annotationSchema.index({ asset: 1, isDeleted: 1 });
annotationSchema.index({ user: 1, createdAt: -1 });

// Add history entry before save
annotationSchema.pre('save', function (next) {
    if (this.isNew) {
        this.history.push({
            user: this.user,
            action: 'created',
            timestamp: new Date()
        });
    }
    next();
});

// Soft delete method
annotationSchema.methods.softDelete = async function (userId) {
    this.isDeleted = true;
    this.history.push({
        user: userId,
        action: 'deleted',
        timestamp: new Date()
    });
    await this.save();
};

module.exports = mongoose.model('Annotation', annotationSchema);
