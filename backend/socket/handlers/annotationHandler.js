const annotationService = require('../../services/annotationService');

const handleAnnotationEvents = (io, socket) => {
    // Create annotation via socket
    socket.on('create_annotation', async ({ assetId, annotationData }) => {
        if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
        }

        try {
            const annotation = await annotationService.createAnnotation(
                { ...annotationData, asset: assetId },
                socket.userId
            );

            // Notify the creator
            socket.emit('annotation_created', { annotation });

            // Broadcast to others viewing the same asset
            socket.to(`asset:${assetId}`).emit('annotation_added', {
                annotation,
                createdBy: {
                    id: socket.userId,
                    name: socket.userName
                }
            });

            console.log(`Annotation created on asset ${assetId} by ${socket.userName}`);

        } catch (error) {
            console.error('Error creating annotation:', error);
            socket.emit('annotation_error', {
                action: 'create',
                message: error.message
            });
        }
    });

    // Update annotation via socket
    socket.on('update_annotation', async ({ annotationId, updates }) => {
        if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
        }

        try {
            const annotation = await annotationService.updateAnnotation(
                annotationId,
                updates,
                socket.userId
            );

            // Notify the updater
            socket.emit('annotation_updated', { annotation });

            // Broadcast to others viewing the same asset
            socket.to(`asset:${annotation.asset}`).emit('annotation_changed', {
                annotation,
                updatedBy: {
                    id: socket.userId,
                    name: socket.userName
                }
            });

            console.log(`Annotation ${annotationId} updated by ${socket.userName}`);

        } catch (error) {
            console.error('Error updating annotation:', error);
            socket.emit('annotation_error', {
                action: 'update',
                annotationId,
                message: error.message
            });
        }
    });

    // Delete annotation via socket
    socket.on('delete_annotation', async ({ annotationId, assetId }) => {
        if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
        }

        try {
            await annotationService.deleteAnnotation(annotationId, socket.userId);

            // Notify the deleter
            socket.emit('annotation_deleted', { annotationId });

            // Broadcast to others viewing the same asset
            socket.to(`asset:${assetId}`).emit('annotation_removed', {
                annotationId,
                deletedBy: {
                    id: socket.userId,
                    name: socket.userName
                }
            });

            console.log(`Annotation ${annotationId} deleted by ${socket.userName}`);

        } catch (error) {
            console.error('Error deleting annotation:', error);
            socket.emit('annotation_error', {
                action: 'delete',
                annotationId,
                message: error.message
            });
        }
    });

    // Real-time annotation editing (optimistic updates)
    socket.on('annotation_editing', ({ assetId, annotationId, field, value }) => {
        // Broadcast typing/editing status to others
        socket.to(`asset:${assetId}`).emit('annotation_being_edited', {
            annotationId,
            field,
            value,
            editedBy: {
                id: socket.userId,
                name: socket.userName
            }
        });
    });
};

module.exports = { handleAnnotationEvents };
