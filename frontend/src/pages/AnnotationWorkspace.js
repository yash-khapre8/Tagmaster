import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assetsAPI } from '../services/api';
import useAnnotations from '../hooks/useAnnotations';
import useAuth from '../hooks/useAuth';
import UserPresence from '../components/UserPresence';
import ImageCanvas from '../components/ImageCanvas';
import { showSuccess, showError, showWarning, showInfo } from '../components/ToastNotification';
import './AnnotationWorkspace.css';

const AnnotationWorkspace = () => {
    const { assetId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        currentAsset,
        setAsset,
        annotations,
        activeUsers,
        createAnnotation,
        updateAnnotation,
        deleteAnnotation,
        loading: annotationsLoading
    } = useAnnotations();

    const [asset, setAssetState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [releasing, setReleasing] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [selectedAnnotation, setSelectedAnnotation] = useState(null);

    useEffect(() => {
        loadAsset();
    }, [assetId]);

    useEffect(() => {
        if (asset) {
            setAsset(asset);
        }
    }, [asset, setAsset]);

    const loadAsset = async () => {
        try {
            setLoading(true);
            const response = await assetsAPI.getAsset(assetId);
            const assetData = response.data.data;

            // Verify user has claimed this asset
            if (assetData.status !== 'claimed' || assetData.claimedBy._id !== user._id) {
                console.error('Asset access denied: not claimed by current user');
                navigate('/dashboard');
                return;
            }

            setAssetState(assetData);
        } catch (error) {
            console.error('Failed to load asset:', error);
            showError('Failed to load asset. Redirecting to dashboard...');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnotation = async () => {
        if (!newLabel.trim()) {
            console.warn('Annotation label is required');
            return;
        }

        const result = await createAnnotation({
            asset: assetId,
            type: 'text_label',
            label: newLabel,
            properties: {}
        });

        if (result.success) {
            setNewLabel('');
            showSuccess('Annotation created successfully');
        } else {
            console.error('Failed to create annotation:', result.error);
            showError(result.error || 'Failed to create annotation');
        }
    };

    const handleDeleteAnnotation = async (annotationId) => {
        if (!window.confirm('Delete this annotation?')) {
            return;
        }

        const result = await deleteAnnotation(annotationId);

        if (result.success) {
            showInfo('Annotation deleted');
        } else {
            console.error('Failed to delete annotation:', result.error);
            showError(result.error || 'Failed to delete annotation');
        }
    };

    const handleRelease = async () => {
        setReleasing(true);
        try {
            await assetsAPI.releaseAsset(assetId);
            showSuccess('Asset released successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to release asset:', error);
            showError('Failed to release asset');
        } finally {
            setReleasing(false);
        }
    };

    const handleComplete = async () => {
        if (annotations.length === 0) {
            console.warn('At least one annotation is required to complete');
            showWarning('Please add at least one annotation before completing');
            return;
        }

        setCompleting(true);
        try {
            await assetsAPI.completeAsset(assetId);
            console.log('Asset completed successfully');
            showSuccess('Asset completed successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to complete asset:', error);
            showError('Failed to complete asset');
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div className="workspace-loading">
                <div>Loading workspace...</div>
            </div>
        );
    }

    if (!asset) {
        return null;
    }

    return (
        <div className="annotation-workspace">
            <div className="workspace-header">
                <div className="header-content">
                    <h2>{asset.title}</h2>
                    <div className="header-actions">
                        <button
                            onClick={handleRelease}
                            className="action-button release"
                            disabled={releasing}
                        >
                            {releasing ? 'Releasing...' : 'Release'}
                        </button>
                        <button
                            onClick={handleComplete}
                            className="action-button complete"
                            disabled={completing}
                        >
                            {completing ? 'Completing...' : 'Complete'}
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="action-button">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="workspace-content">
                <div className="workspace-main">
                    {asset.type === 'image' && asset.url && (
                        <ImageCanvas
                            imageUrl={asset.url}
                            assetId={assetId}
                            annotations={annotations}
                            onAddAnnotation={createAnnotation}
                            onUpdateAnnotation={updateAnnotation}
                            onDeleteAnnotation={deleteAnnotation}
                        />
                    )}

                    {asset.type === 'text' && asset.content && (
                        <div className="text-viewer">
                            <p>{asset.content}</p>
                        </div>
                    )}
                </div>

                <div className="workspace-sidebar">
                    <UserPresence activeUsers={activeUsers} />

                    <div className="annotations-panel">
                        <h3>Annotations ({annotations.length})</h3>

                        <div className="create-annotation">
                            <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Enter annotation label..."
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateAnnotation()}
                            />
                            <button onClick={handleCreateAnnotation}>Add</button>
                        </div>

                        <div className="annotations-list">
                            {annotationsLoading ? (
                                <div className="loading-annotations">Loading...</div>
                            ) : annotations.length === 0 ? (
                                <div className="no-annotations">No annotations yet</div>
                            ) : (
                                annotations.map(annotation => (
                                    <div
                                        key={annotation._id}
                                        className={`annotation-item ${selectedAnnotation === annotation._id ? 'selected' : ''}`}
                                        onClick={() => setSelectedAnnotation(annotation._id)}
                                    >
                                        <div className="annotation-header">
                                            <span className="annotation-label">{annotation.label}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAnnotation(annotation._id);
                                                }}
                                                className="delete-button"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="annotation-meta">
                                            <span className="annotation-type">{annotation.type}</span>
                                            {annotation.user && (
                                                <span className="annotation-author">
                                                    by {annotation.user.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnotationWorkspace;
