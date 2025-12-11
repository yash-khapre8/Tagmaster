const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const assetService = require('../../services/assetService');

// Store active connections
const activeUsers = new Map(); // userId -> Set of socket IDs
const socketToUser = new Map(); // socketId -> userId
const assetRooms = new Map(); // assetId -> Set of userIds

const handleConnection = (io, socket) => {
    console.log('New socket connection:', socket.id);

    // Authenticate socket connection
    socket.on('authenticate', async (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user || !user.isActive) {
                socket.emit('auth_error', { message: 'Authentication failed' });
                socket.disconnect();
                return;
            }

            // Store user connection
            socket.userId = user._id.toString();
            socket.userName = user.name;
            socket.userEmail = user.email;

            if (!activeUsers.has(socket.userId)) {
                activeUsers.set(socket.userId, new Set());
            }
            activeUsers.get(socket.userId).add(socket.id);
            socketToUser.set(socket.id, socket.userId);

            socket.emit('authenticated', {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

            console.log(`User ${user.name} authenticated on socket ${socket.id}`);

            // Broadcast user online status
            io.emit('user_online', {
                userId: socket.userId,
                userName: socket.userName
            });

        } catch (error) {
            console.error('Socket authentication error:', error);
            socket.emit('auth_error', { message: 'Invalid token' });
            socket.disconnect();
        }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
        console.log('Socket disconnected:', socket.id);

        const userId = socketToUser.get(socket.id);

        if (userId) {
            // Remove socket from active users
            if (activeUsers.has(userId)) {
                activeUsers.get(userId).delete(socket.id);

                // If user has no more active sockets, remove from active users
                if (activeUsers.get(userId).size === 0) {
                    activeUsers.delete(userId);

                    // Broadcast user offline status
                    io.emit('user_offline', { userId });

                    // Release any assets claimed by this user
                    try {
                        const releasedAssets = await releaseUserAssets(userId);

                        releasedAssets.forEach(assetId => {
                            io.emit('asset_released', { assetId, userId });
                        });
                    } catch (error) {
                        console.error('Error releasing assets on disconnect:', error);
                    }
                }
            }

            socketToUser.delete(socket.id);

            // Leave all asset rooms
            assetRooms.forEach((users, assetId) => {
                if (users.has(userId)) {
                    users.delete(userId);
                    socket.to(`asset:${assetId}`).emit('user_left_asset', {
                        assetId,
                        userId,
                        userName: socket.userName
                    });
                }
            });
        }
    });

    // Join asset room
    socket.on('join_asset', ({ assetId }) => {
        if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
        }

        socket.join(`asset:${assetId}`);

        // Track users in asset room
        if (!assetRooms.has(assetId)) {
            assetRooms.set(assetId, new Set());
        }
        assetRooms.get(assetId).add(socket.userId);

        // Notify others in the room
        socket.to(`asset:${assetId}`).emit('user_joined_asset', {
            assetId,
            userId: socket.userId,
            userName: socket.userName
        });

        console.log(`User ${socket.userName} joined asset ${assetId}`);
    });

    // Leave asset room
    socket.on('leave_asset', ({ assetId }) => {
        socket.leave(`asset:${assetId}`);

        if (assetRooms.has(assetId)) {
            assetRooms.get(assetId).delete(socket.userId);
        }

        socket.to(`asset:${assetId}`).emit('user_left_asset', {
            assetId,
            userId: socket.userId,
            userName: socket.userName
        });

        console.log(`User ${socket.userName} left asset ${assetId}`);
    });

    // Handle cursor movement (for collaborative features)
    socket.on('cursor_move', ({ assetId, position }) => {
        socket.to(`asset:${assetId}`).emit('user_cursor', {
            userId: socket.userId,
            userName: socket.userName,
            position
        });
    });
};

// Helper function to release all assets claimed by a user
const releaseUserAssets = async (userId) => {
    const Asset = require('../../models/Asset');

    const claimedAssets = await Asset.find({
        claimedBy: userId,
        status: 'claimed'
    });

    const releasedAssetIds = [];

    for (const asset of claimedAssets) {
        try {
            await assetService.releaseAsset(asset._id, userId, true); // Admin override
            releasedAssetIds.push(asset._id.toString());
        } catch (error) {
            console.error(`Error releasing asset ${asset._id}:`, error);
        }
    }

    return releasedAssetIds;
};

// Get active users
const getActiveUsers = () => {
    return Array.from(activeUsers.keys());
};

// Get users in asset room
const getUsersInAssetRoom = (assetId) => {
    return Array.from(assetRooms.get(assetId) || []);
};

module.exports = {
    handleConnection,
    getActiveUsers,
    getUsersInAssetRoom
};
