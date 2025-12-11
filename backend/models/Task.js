const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'abandoned'],
        default: 'in_progress',
        index: true
    },
    startedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    completedAt: {
        type: Date
    },
    abandonedAt: {
        type: Date
    },
    timeSpent: {
        type: Number, // in milliseconds
        default: 0
    },
    annotations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annotation'
    }],
    annotationCount: {
        type: Number,
        default: 0
    },
    quality: {
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedAt: Date,
        feedback: String
    }
}, {
    timestamps: true
});

// Compound indexes
taskSchema.index({ user: 1, status: 1, createdAt: -1 });
taskSchema.index({ asset: 1, user: 1 });

// Calculate time spent when completing
taskSchema.methods.complete = async function () {
    this.status = 'completed';
    this.completedAt = new Date();
    this.timeSpent = this.completedAt - this.startedAt;
    await this.save();

    // Update user stats
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.user, {
        $inc: {
            'stats.tasksCompleted': 1,
            'stats.totalTimeSpent': this.timeSpent
        }
    });
};

// Mark as abandoned
taskSchema.methods.abandon = async function () {
    this.status = 'abandoned';
    this.abandonedAt = new Date();
    this.timeSpent = this.abandonedAt - this.startedAt;
    await this.save();
};

module.exports = mongoose.model('Task', taskSchema);
