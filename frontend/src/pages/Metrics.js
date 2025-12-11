import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { metricsAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import './Metrics.css';

const Metrics = () => {
    const navigate = useNavigate();
    const { user, isManager } = useAuth();

    const [metrics, setMetrics] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        try {
            setLoading(true);

            // Load user metrics
            const metricsResponse = await metricsAPI.getMyMetrics();
            setMetrics(metricsResponse.data.data);

            // Load dashboard metrics if manager
            if (isManager) {
                const dashboardResponse = await metricsAPI.getDashboard();
                setDashboard(dashboardResponse.data.data);
            }
        } catch (error) {
            console.error('Failed to load metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (ms) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    if (loading) {
        return (
            <div className="metrics-loading">
                <div>Loading metrics...</div>
            </div>
        );
    }

    return (
        <div className="metrics-page">
            <div className="metrics-header">
                <h1>Performance Metrics</h1>
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    Back to Dashboard
                </button>
            </div>

            <div className="metrics-content">
                <div className="metrics-section">
                    <h2>Your Performance</h2>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-value">{metrics?.stats?.tasksCompleted || 0}</div>
                            <div className="metric-label">Tasks Completed</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-value">{metrics?.stats?.annotationsCreated || 0}</div>
                            <div className="metric-label">Annotations Created</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-value">{metrics?.stats?.productivityScore || 0}%</div>
                            <div className="metric-label">Productivity Score</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-value">
                                {formatTime(metrics?.stats?.totalTimeSpent || 0)}
                            </div>
                            <div className="metric-label">Total Time Spent</div>
                        </div>
                    </div>

                    {metrics?.recentTasks && metrics.recentTasks.length > 0 && (
                        <div className="recent-tasks">
                            <h3>Recent Tasks</h3>
                            <div className="tasks-list">
                                {metrics.recentTasks.map((task) => (
                                    <div key={task._id} className="task-item">
                                        <div className="task-info">
                                            <span className="task-title">{task.asset?.title || 'Unknown'}</span>
                                            <span className={`task-status ${task.status}`}>{task.status}</span>
                                        </div>
                                        <div className="task-meta">
                                            <span>{task.asset?.type}</span>
                                            <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Manager Dashboard */}
                {isManager && dashboard && (
                    <div className="metrics-section">
                        <h2>Team Dashboard</h2>

                        <div className="metrics-grid">
                            <div className="metric-card">
                                <div className="metric-value">{dashboard.overview.totalUsers}</div>
                                <div className="metric-label">Active Users</div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-value">{dashboard.overview.completedTasks}</div>
                                <div className="metric-label">Total Completed</div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-value">{dashboard.overview.totalAnnotations}</div>
                                <div className="metric-label">Total Annotations</div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-value">{dashboard.overview.completionRate}%</div>
                                <div className="metric-label">Completion Rate</div>
                            </div>
                        </div>

                        {dashboard.topAnnotators && dashboard.topAnnotators.length > 0 && (
                            <div className="top-annotators">
                                <h3>Top Annotators</h3>
                                <div className="annotators-list">
                                    {dashboard.topAnnotators.slice(0, 5).map((annotator, index) => (
                                        <div key={annotator.user.id} className="annotator-item">
                                            <div className="annotator-rank">#{index + 1}</div>
                                            <div className="annotator-info">
                                                <div className="annotator-name">{annotator.user.name}</div>
                                                <div className="annotator-stats">
                                                    {annotator.annotationsCreated} annotations • {annotator.tasksCompleted} tasks
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Metrics;
