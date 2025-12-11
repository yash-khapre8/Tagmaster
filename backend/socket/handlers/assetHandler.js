const assetService = require('../../services/assetService');

const handleAssetEvents = (io, socket) => {
    // Claim asset via socket
    socket.on('claim_asset', async ({ assetId }) => {
        if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
        }

        try {
            const result = await assetService.claimAsset(assetId, socket.userId);

            // Notify the user who claimed it
            socket.emit('asset_claimed', {
                asset: result.asset,
                task: result.task
            });

            // Broadcast to all other users that asset is no longer available
            socket.broadcast.emit('asset_unavailable', {
                assetId,
                claimedBy: socket.userId,
                claimedByName: socket.userName
            });

            console.log(`Asset ${assetId} claimed by ${socket.userName}`);

        } catch (error) {
            console.error('Error claiming asset:', error);
            socket.emit('claim_error', {
                assetId,
                message: error.message
            });
        }
    });

    // Release asset via socket
    socket.on('release_asset', async ({ assetId }) => {
        if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
        }

        try {
            const asset = await assetService.releaseAsset(assetId, socket.userId);

            // Notify the user
            socket.emit('asset_released', {
                assetId,
                userId: socket.userId
            });

            // Broadcast to all users that asset is now available
            io.emit('asset_available', {
                asset
            });

            console.log(`Asset ${assetId} released by ${socket.userName}`);

        } catch (error) {
            console.error('Error releasing asset:', error);
            socket.emit('release_error', {
                assetId,
                message: error.message
            });
        }
    });

    // Complete asset via socket
    socket.on('complete_asset', async ({ assetId }) => {
        if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
        }

        try {
            const asset = await assetService.completeAsset(assetId, socket.userId);

            // Notify the user
            socket.emit('asset_completed', {
                assetId,
                userId: socket.userId
            });

            // Broadcast to all users
            io.emit('asset_completed_broadcast', {
                assetId,
                completedBy: socket.userId,
                completedByName: socket.userName
            });

            console.log(`Asset ${assetId} completed by ${socket.userName}`);

        } catch (error) {
            console.error('Error completing asset:', error);
            socket.emit('complete_error', {
                assetId,
                message: error.message
            });
        }
    });
};

module.exports = { handleAssetEvents };
