import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { annotationsAPI } from '../services/api';
import { SocketContext } from './SocketContext';
import { showWarning, showError, showInfo } from '../components/ToastNotification';

export const AnnotationContext = createContext();

export const AnnotationProvider = ({ children }) => {
    const [currentAsset, setCurrentAsset] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const { socketService, isConnected } = useContext(SocketContext);

    // Load annotations for an asset
    const loadAnnotations = useCallback(async (assetId) => {
        try {
            setLoading(true);
            const response = await annotationsAPI.getByAsset(assetId);
            setAnnotations(response.data.data);
        } catch (error) {
            console.error('Failed to load annotations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Set current asset and load its annotations
    const setAsset = useCallback((asset) => {
        setCurrentAsset(asset);
        if (asset) {
            loadAnnotations(asset._id);

            // Join asset room for real-time updates
            if (isConnected) {
                socketService.joinAsset(asset._id);
            }
        }
    }, [loadAnnotations, isConnected, socketService]);

    // Real-time event handlers
    useEffect(() => {
        if (!isConnected || !currentAsset) return;

        // Annotation added by another user
        const handleAnnotationAdded = (data) => {
            setAnnotations(prev => [data.annotation, ...prev]);
            showInfo(`${data.annotation.user?.name || 'Someone'} added an annotation`);
        };

        // Annotation updated by another user
        const handleAnnotationChanged = (data) => {
            setAnnotations(prev =>
                prev.map(ann => ann._id === data.annotation._id ? data.annotation : ann)
            );
            showInfo(`${data.annotation.lastModifiedBy?.name || 'Someone'} updated an annotation`);
        };

        // Annotation deleted by another user
        const handleAnnotationRemoved = (data) => {
            setAnnotations(prev => prev.filter(ann => ann._id !== data.annotationId));
        };

        // User presence
        const handleUserJoined = (data) => {
            setActiveUsers(prev => [...prev, data]);
        };

        const handleUserLeft = (data) => {
            setActiveUsers(prev => prev.filter(u => u.userId !== data.userId));
        };

        // Register listeners
        socketService.on('annotation_added', handleAnnotationAdded);
        socketService.on('annotation_changed', handleAnnotationChanged);
        socketService.on('annotation_removed', handleAnnotationRemoved);
        socketService.on('user_joined_asset', handleUserJoined);
        socketService.on('user_left_asset', handleUserLeft);

        // Cleanup
        return () => {
            socketService.off('annotation_added', handleAnnotationAdded);
            socketService.off('annotation_changed', handleAnnotationChanged);
            socketService.off('annotation_removed', handleAnnotationRemoved);
            socketService.off('user_joined_asset', handleUserJoined);
            socketService.off('user_left_asset', handleUserLeft);

            if (currentAsset) {
                socketService.leaveAsset(currentAsset._id);
            }
        };
    }, [isConnected, currentAsset, socketService]);

    // Create annotation (optimistic update)
    const createAnnotation = useCallback(async (annotationData) => {
        try {
            // Create via API
            const response = await annotationsAPI.create(annotationData);
            const newAnnotation = response.data.data;

            // Update local state (optimistic)
            setAnnotations(prev => [newAnnotation, ...prev]);

            // Also emit via socket for real-time sync
            if (isConnected) {
                socketService.createAnnotation(annotationData.asset, annotationData);
            }

            return { success: true, annotation: newAnnotation };
        } catch (error) {
            console.error('Failed to create annotation:', error);
            return { success: false, error: error.response?.data?.message };
        }
    }, [isConnected, socketService]);

    // Update annotation with conflict detection
    const updateAnnotation = useCallback(async (annotationId, updates) => {
        try {
            // Find current annotation to get its version
            const currentAnnotation = annotations.find(ann => ann._id === annotationId);
            if (!currentAnnotation) {
                return { success: false, error: 'Annotation not found locally' };
            }

            // Include version for optimistic concurrency control
            const updateData = {
                ...updates,
                version: currentAnnotation.version
            };

            const response = await annotationsAPI.update(annotationId, updateData);

            // Check for conflict response
            if (response.status === 409 || response.data?.conflict) {
                showWarning('This annotation was modified by another user. Refreshing data...');
                // Reload annotations to get latest data
                if (currentAsset) {
                    await loadAnnotations(currentAsset._id);
                }
                return { success: false, conflict: true, error: 'Conflict detected' };
            }

            const updatedAnnotation = response.data.data;

            // Update local state
            setAnnotations(prev =>
                prev.map(ann => ann._id === annotationId ? updatedAnnotation : ann)
            );

            // Emit via socket
            if (isConnected) {
                socketService.updateAnnotation(annotationId, updates);
            }

            return { success: true, annotation: updatedAnnotation };
        } catch (error) {
            // Handle conflict error
            if (error.response?.status === 409 || error.response?.data?.conflict) {
                showWarning('This annotation was modified by another user. Refreshing...');
                if (currentAsset) {
                    await loadAnnotations(currentAsset._id);
                }
                return { success: false, conflict: true, error: 'Annotation conflict' };
            }

            console.error('Failed to update annotation:', error);
            return { success: false, error: error.response?.data?.message };
        }
    }, [annotations, isConnected, socketService, currentAsset, loadAnnotations]);

    // Delete annotation
    const deleteAnnotation = useCallback(async (annotationId) => {
        try {
            await annotationsAPI.delete(annotationId);

            // Update local state
            setAnnotations(prev => prev.filter(ann => ann._id !== annotationId));

            // Emit via socket
            if (isConnected && currentAsset) {
                socketService.deleteAnnotation(annotationId, currentAsset._id);
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to delete annotation:', error);
            return { success: false, error: error.response?.data?.message };
        }
    }, [isConnected, currentAsset, socketService]);

    const value = {
        currentAsset,
        setAsset,
        annotations,
        loading,
        activeUsers,
        createAnnotation,
        updateAnnotation,
        deleteAnnotation,
        reloadAnnotations: loadAnnotations
    };

    return <AnnotationContext.Provider value={value}>{children}</AnnotationContext.Provider>;
};
