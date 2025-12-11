const Task = require('../models/Task');
const User = require('../models/User');
const Annotation = require('../models/Annotation');

// Get user metrics
const getUserMetrics = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    // Get task statistics
    const tasks = await Task.find({ user: userId });

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const abandonedTasks = tasks.filter(t => t.status === 'abandoned');

    // Calculate average time per task
    const avgTimePerTask = completedTasks.length > 0
        ? completedTasks.reduce((sum, task) => sum + task.timeSpent, 0) / completedTasks.length
        : 0;

    // Get annotation count
    const annotationCount = await Annotation.countDocuments({
        user: userId,
        isDeleted: false
    });

    // Calculate productivity score (simple formula)
    const productivityScore = completedTasks.length > 0
        ? Math.round((completedTasks.length / (completedTasks.length + abandonedTasks.length)) * 100)
        : 0;

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        stats: {
            tasksCompleted: completedTasks.length,
            tasksInProgress: inProgressTasks.length,
            tasksAbandoned: abandonedTasks.length,
            totalTasks: tasks.length,
            annotationsCreated: annotationCount,
            totalTimeSpent: user.stats.totalTimeSpent,
            avgTimePerTask: Math.round(avgTimePerTask),
            productivityScore
        },
        recentTasks: await Task.find({ user: userId })
            .populate('asset', 'title type')
            .sort({ updatedAt: -1 })
            .limit(10)
    };
};

// Get dashboard metrics (for managers)
const getDashboardMetrics = async () => {
    const users = await User.find({ isActive: true });
    const tasks = await Task.find();
    const annotations = await Annotation.find({ isDeleted: false });

    // Overall statistics
    const totalUsers = users.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const totalAnnotations = annotations.length;

    // Calculate average productivity
    const avgProductivity = users.length > 0
        ? users.reduce((sum, user) => {
            const userTasks = tasks.filter(t => t.user.toString() === user._id.toString());
            const completed = userTasks.filter(t => t.status === 'completed').length;
            const abandoned = userTasks.filter(t => t.status === 'abandoned').length;
            const score = (completed + abandoned) > 0
                ? completed / (completed + abandoned)
                : 0;
            return sum + score;
        }, 0) / users.length * 100
        : 0;

    // Top annotators
    const userStats = await Promise.all(
        users.map(async (user) => {
            const userTasks = tasks.filter(t => t.user.toString() === user._id.toString());
            const completed = userTasks.filter(t => t.status === 'completed').length;
            const userAnnotations = annotations.filter(a => a.user.toString() === user._id.toString()).length;

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                tasksCompleted: completed,
                annotationsCreated: userAnnotations,
                totalTimeSpent: user.stats.totalTimeSpent
            };
        })
    );

    const topAnnotators = userStats
        .sort((a, b) => b.annotationsCreated - a.annotationsCreated)
        .slice(0, 10);

    // Recent activity
    const recentActivity = await Task.find()
        .populate('user', 'name email')
        .populate('asset', 'title type')
        .sort({ updatedAt: -1 })
        .limit(20);

    return {
        overview: {
            totalUsers,
            totalTasks,
            completedTasks,
            inProgressTasks,
            totalAnnotations,
            avgProductivity: Math.round(avgProductivity),
            completionRate: totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0
        },
        topAnnotators,
        recentActivity
    };
};

// Get project metrics
const getProjectMetrics = async (projectName) => {
    const Asset = require('../models/Asset');

    const assets = await Asset.find({ project: projectName });
    const assetIds = assets.map(a => a._id);

    const tasks = await Task.find({ asset: { $in: assetIds } });
    const annotations = await Annotation.find({
        asset: { $in: assetIds },
        isDeleted: false
    });

    const totalAssets = assets.length;
    const availableAssets = assets.filter(a => a.status === 'available').length;
    const claimedAssets = assets.filter(a => a.status === 'claimed').length;
    const completedAssets = assets.filter(a => a.status === 'completed').length;

    return {
        project: projectName,
        assets: {
            total: totalAssets,
            available: availableAssets,
            claimed: claimedAssets,
            completed: completedAssets,
            completionRate: totalAssets > 0
                ? Math.round((completedAssets / totalAssets) * 100)
                : 0
        },
        tasks: {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'completed').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length
        },
        annotations: {
            total: annotations.length,
            avgPerAsset: completedAssets > 0
                ? Math.round(annotations.length / completedAssets)
                : 0
        }
    };
};

module.exports = {
    getUserMetrics,
    getDashboardMetrics,
    getProjectMetrics
};
