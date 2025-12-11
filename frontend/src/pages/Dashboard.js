import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetsAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import AssetCard from '../components/AssetCard';
import { useDebounce } from '../hooks/useDebounce';
import { showSuccess, showError } from '../components/ToastNotification';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        project: '',
        type: 'all'
    });

    // Debounced search to avoid excessive API calls
    const debouncedSearch = useDebounce((query) => {
        // Filter is done client-side for better UX
        console.log('Searching for:', query);
    }, 300);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const response = await assetsAPI.getAssets();
            setAssets(response.data.data);
        } catch (error) {
            console.error('Failed to fetch assets:', error);
            showError('Failed to load assets');
        } finally {
            setLoading(false);
        }
    };

    const handleClaimAsset = async (assetId) => {
        setClaiming(assetId);

        try {
            const response = await assetsAPI.claimAsset(assetId);
            const asset = response.data.data.asset;

            showSuccess(`Asset "${asset.title}" claimed successfully!`);

            // Navigate to annotation workspace
            navigate(`/workspace/${asset._id}`);
        } catch (error) {
            console.error('Failed to claim asset:', error.response?.data?.message || error.message);
            showError(error.response?.data?.message || 'Failed to claim asset');
        } finally {
            setClaiming(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Filter assets
    const filteredAssets = assets.filter(asset => {
        const matchesProject = !filters.project ||
            asset.project?.toLowerCase().includes(filters.project.toLowerCase());
        const matchesType = filters.type === 'all' || asset.type === filters.type;
        return matchesProject && matchesType;
    });

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>TagMaster</h1>

                    <div className="header-info">
                        <div className="user-badge">
                            <div className="user-status"></div>
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>

                        <div className="header-actions">
                            {(user.role === 'manager' || user.role === 'admin') && (
                                <button className="nav-button" onClick={() => navigate('/admin')}>
                                    + Add Asset
                                </button>
                            )}
                            <button className="nav-button" onClick={() => navigate('/metrics')}>
                                Metrics
                            </button>
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="dashboard-content">
                <div className="content-header">
                    <h2>Asset Queue</h2>
                    <p>Select an asset to begin annotation</p>
                </div>

                {/* Filters */}
                <div className="filters">
                    <div className="filter-group">
                        <label>Search Project</label>
                        <input
                            type="text"
                            placeholder="Filter by project..."
                            value={filters.project}
                            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Asset Type</label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="all">All Types</option>
                            <option value="image">Image</option>
                            <option value="text">Text</option>
                        </select>
                    </div>

                    <button className="refresh-button" onClick={fetchAssets}>
                        Refresh
                    </button>
                </div>

                {/* Assets Grid */}
                <div className="assets-section">
                    {loading ? (
                        <div className="loading">Loading assets...</div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>{assets.filter(a => a.status === 'available').length}</h3>
                                <p>Available Assets</p>
                            </div>
                            <div className="stat-card">
                                <h3>{user.stats?.annotationsCreated || 0}</h3>
                                <p>Annotations Created</p>
                            </div>
                            <div className="stat-card">
                                <h3>{user.stats?.assetsCompleted || 0}</h3>
                                <p>Assets Completed</p>
                            </div>
                        </div>
                    ) : (
                        <div className="assets-grid">
                            {filteredAssets.map((asset) => (
                                <AssetCard
                                    key={asset._id}
                                    asset={asset}
                                    onClaim={() => handleClaimAsset(asset._id)}
                                    claiming={claiming === asset._id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
