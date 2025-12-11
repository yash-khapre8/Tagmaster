import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Login.css';
import './LoginShapes.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, register, error: authError } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'annotator'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;

            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(formData);
            }

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Animated geometric shapes */}
            <div className="geometric-shape hex-blue-1"></div>
            <div className="geometric-shape hex-blue-2"></div>
            <div className="geometric-shape hex-blue-3"></div>
            <div className="geometric-shape hex-yellow-1"></div>
            <div className="geometric-shape hex-yellow-2"></div>
            <div className="geometric-shape hex-yellow-3"></div>
            <div className="geometric-shape cube-grey-1"></div>
            <div className="geometric-shape cube-grey-2"></div>
            <div className="geometric-shape cube-grey-3"></div>

            <div className="login-card">
                {/* Hero Section */}
                <div className="login-hero">
                    <h1>The data factory for AI teams</h1>
                    <p>
                        TagMaster delivers real-time collaborative annotation services for your modern AI data factory
                    </p>

                    <div className="hero-features">
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Real-time multi-user collaboration</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Conflict-free asset management</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Instant synchronization across teams</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Production-ready ML workflows</span>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="login-form-section">
                    <div className="login-header">
                        <h2>{isLogin ? 'Welcome back' : 'Get started'}</h2>
                        <p>{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
                    </div>

                    <div className="login-tabs">
                        <button
                            className={`tab ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Sign In
                        </button>
                        <button
                            className={`tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    placeholder="Enter your name"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Enter your password"
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="annotator">Annotator</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                        )}

                        {(error || authError) && (
                            <div className="error-message">
                                {error || authError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                className="toggle-button"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
