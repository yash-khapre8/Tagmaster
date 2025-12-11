import React from 'react';
import './AssetCard.css';

const AssetCard = ({ asset, onClaim, claiming = false }) => {
    const handleClaim = () => {
        if (!claiming && onClaim) {
            onClaim(asset._id);
        }
    };

    const getStatusBadge = () => {
        const statusColors = {
            available: '#10b981',
            claimed: '#f59e0b',
            completed: '#6366f1'
        };

        return (
            <span
                className="status-badge"
                style={{ backgroundColor: statusColors[asset.status] || '#gray-500' }}
            >
                {asset.status}
            </span>
        );
    };

    return (
        <div className="asset-card">
            {asset.type === 'image' && asset.url && (
                <div className="asset-preview">
                    <img src={asset.url} alt={asset.title} />
                </div>
            )}

            <div className="asset-content">
                <div className="asset-header">
                    <h3 className="asset-title">{asset.title}</h3>
                    {getStatusBadge()}
                </div>

                {asset.description && (
                    <p className="asset-description">{asset.description}</p>
                )}

                <div className="asset-meta">
                    <span className="asset-type">{asset.type}</span>
                    <span className="asset-project">{asset.project}</span>
                </div>

                {asset.status === 'available' && (
                    <button
                        className="claim-button"
                        onClick={handleClaim}
                        disabled={claiming}
                    >
                        {claiming ? 'Claiming...' : 'Claim Asset'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AssetCard;
