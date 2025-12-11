const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'text'],
        required: true
    },
    url: {
        type: String,
        required: function () {
            return this.type === 'image';
        }
    },
    content: {
        type: String,
        required: function () {
            return this.type === 'text';
        }
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'completed'],
        default: 'available',
        index: true
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    claimedAt: {
        type: Date,
        default: null
    },
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
    project: {
        type: String,
        required: true,
        index: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    priority: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index for efficient queue queries
assetSchema.index({ status: 1, priority: -1, createdAt: 1 });
assetSchema.index({ project: 1, status: 1 });

// Method to check if asset is stale (claimed too long)
assetSchema.methods.isStale = function () {
    if (this.status !== 'claimed' || !this.claimedAt) {
        return false;
    }

    const timeout = parseInt(process.env.ASSET_CLAIM_TIMEOUT) || 1800000; // 30 min default
    const now = new Date();
    return (now - this.claimedAt) > timeout;
};

// Method to release asset
assetSchema.methods.release = async function () {
    this.status = 'available';
    this.claimedBy = null;
    this.claimedAt = null;
    await this.save();
};

module.exports = mongoose.model('Asset', assetSchema);
