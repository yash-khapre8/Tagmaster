import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetsAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [assetData, setAssetData] = useState({
        type: 'image',
        url: '',
        textContent: '',
        project: '',
        title: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Only allow managers and admins
    if (user?.role === 'annotator') {
        return (
            <div className="admin-panel">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>Only managers and admins can add new assets.</p>
                    <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Validate
            if (assetData.type === 'image' && !assetData.url) {
                setMessage('Please provide an image URL');
                setLoading(false);
                return;
            }

            if (assetData.type === 'text' && !assetData.textContent) {
                setMessage('Please provide text content');
                setLoading(false);
                return;
            }

            if (!assetData.project || !assetData.title) {
                setMessage('Project and Title are required');
                setLoading(false);
                return;
            }

            // Create asset
            const payload = {
                type: assetData.type,
                project: assetData.project,
                title: assetData.title,
                description: assetData.description,
                metadata: {}
            };

            if (assetData.type === 'image') {
                payload.url = assetData.url;
            } else {
                payload.textContent = assetData.textContent;
            }

            await assetsAPI.createAsset(payload);

            setMessage('✅ Asset created successfully!');

            // Reset form
            setAssetData({
                type: 'image',
                url: '',
                textContent: '',
                project: '',
                title: '',
                description: ''
            });

        } catch (error) {
            setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Add New Asset</h1>
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
            </div>

            <div className="admin-content">
                <form onSubmit={handleSubmit} className="asset-form">

                    {/* Asset Type */}
                    <div className="form-group">
                        <label>Asset Type</label>
                        <select
                            value={assetData.type}
                            onChange={(e) => setAssetData({ ...assetData, type: e.target.value })}
                        >
                            <option value="image">Image</option>
                            <option value="text">Text</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            placeholder="e.g., Dog Photo, Sample Text"
                            value={assetData.title}
                            onChange={(e) => setAssetData({ ...assetData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Project Name */}
                    <div className="form-group">
                        <label>Project Name *</label>
                        <input
                            type="text"
                            placeholder="e.g., Animal Classification, Sentiment Analysis"
                            value={assetData.project}
                            onChange={(e) => setAssetData({ ...assetData, project: e.target.value })}
                            required
                        />
                    </div>

                    {/* Image URL (if image) */}
                    {assetData.type === 'image' && (
                        <div className="form-group">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={assetData.url}
                                onChange={(e) => setAssetData({ ...assetData, url: e.target.value })}
                                required
                            />
                            <small>Provide a direct link to an image (jpg, png, etc.)</small>
                        </div>
                    )}

                    {/* Text Content (if text) */}
                    {assetData.type === 'text' && (
                        <div className="form-group">
                            <label>Text Content *</label>
                            <textarea
                                placeholder="Enter the text to be annotated..."
                                value={assetData.textContent}
                                onChange={(e) => setAssetData({ ...assetData, textContent: e.target.value })}
                                rows={6}
                                required
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                            placeholder="Additional notes or instructions..."
                            value={assetData.description}
                            onChange={(e) => setAssetData({ ...assetData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Asset'}
                    </button>

                </form>

                {/* Quick Examples */}
                <div className="examples">
                    <h3>Quick Examples</h3>

                    <div className="example-box">
                        <h4>Image Asset</h4>
                        <code>
                            Type: Image<br />
                            Title: Dog Photo<br />
                            Project: Animal Classification<br />
                            URL: https://images.unsplash.com/photo-1543466835-00a7907e9de1
                        </code>
                    </div>

                    <div className="example-box">
                        <h4>Text Asset</h4>
                        <code>
                            Type: Text<br />
                            Title: Customer Review<br />
                            Project: Sentiment Analysis<br />
                            Content: "This product is amazing! Highly recommend."
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
