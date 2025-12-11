import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
    const navigate = useNavigate();

    return (
        <div className="services-page">
            <nav className="services-nav">
                <div className="nav-content">
                    <div className="nav-logo" onClick={() => navigate('/')}>
                        <h2>TagMaster</h2>
                    </div>
                    <button onClick={() => navigate('/')} className="nav-back">
                        Back to Home
                    </button>
                </div>
            </nav>

            <section className="services-hero">
                <div className="hero-content">
                    <div className="service-badge">
                        <span className="badge-icon">🏷️</span>
                        <span>Labeling services</span>
                    </div>
                    <h1>Work with the world's best AI trainers and labelers</h1>
                    <p>
                        Experience the next level of data labeling and model eval services with direct
                        access to fully managed data labeling teams that have deep expertise across
                        domains and languages. Set new standards in quality and throughput at half
                        the cost.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => navigate('/login')}>
                            Contact us
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/login')}>
                            Start for free
                        </button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="visual-mockup">
                        <div className="mockup-header">
                            <div className="header-tabs">
                                <div className="tab active">Task overview</div>
                                <div className="tab">Team performance</div>
                            </div>
                        </div>
                        <div className="mockup-content">
                            <div className="task-card">
                                <div className="task-status">In Progress</div>
                                <div className="task-title">Image classification - Batch #47</div>
                                <div className="task-meta">
                                    <span>245 items completed</span>
                                    <span>•</span>
                                    <span>98.5% accuracy</span>
                                </div>
                            </div>
                            <div className="annotator-profiles">
                                <div className="profile-item">
                                    <div className="avatar">JD</div>
                                    <div className="profile-info">
                                        <div className="name">Jane Doe</div>
                                        <div className="role">Senior Annotator</div>
                                    </div>
                                </div>
                                <div className="profile-item">
                                    <div className="avatar">MS</div>
                                    <div className="profile-info">
                                        <div className="name">Mike Smith</div>
                                        <div className="role">Quality Lead</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="services-options">
                <h2>Choose TagMaster to operate or staff your AI data factory</h2>

                <div className="options-grid">
                    <div className="option-card">
                        <div className="option-icon blue">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h3>Managed workforce</h3>
                        <p>
                            Access our global network of expert annotators and AI trainers.
                            We handle recruitment, training, and quality assurance so you can
                            focus on building better models.
                        </p>
                        <a href="#" className="option-link">Learn more →</a>
                    </div>

                    <div className="option-card">
                        <div className="option-icon yellow">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h3>Hybrid model</h3>
                        <p>
                            Combine your in-house team with our expert annotators for maximum
                            flexibility. Scale up or down as needed while maintaining consistent
                            quality across all your annotation projects.
                        </p>
                        <a href="#" className="option-link">Learn more →</a>
                    </div>

                    <div className="option-card">
                        <div className="option-icon green">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <h3>Quality-first approach</h3>
                        <p>
                            Our rigorous quality control processes ensure accuracy rates above 95%.
                            With built-in review workflows and automated validation, your data
                            meets the highest standards.
                        </p>
                        <a href="#" className="option-link">Learn more →</a>
                    </div>
                </div>
            </section>

            <section className="services-features">
                <div className="feature-row">
                    <div className="feature-content">
                        <h3>Expert network across 70+ countries</h3>
                        <p>
                            Tap into our diverse network of AI trainers and annotators with specialized
                            expertise in computer vision, NLP, speech recognition, and more. Native speakers
                            for 100+ languages ensure cultural accuracy and linguistic precision.
                        </p>
                    </div>
                    <div className="feature-stat">
                        <div className="stat-number">70+</div>
                        <div className="stat-label">Countries</div>
                    </div>
                </div>

                <div className="feature-row reverse">
                    <div className="feature-stat">
                        <div className="stat-number">95%</div>
                        <div className="stat-label">Accuracy Rate</div>
                    </div>
                    <div className="feature-content">
                        <h3>Unmatched quality standards</h3>
                        <p>
                            Our multi-tier review process and AI-powered quality checks ensure your
                            annotations meet the highest standards. Real-time monitoring and feedback
                            loops maintain consistency across large-scale projects.
                        </p>
                    </div>
                </div>
            </section>

            <section className="services-cta">
                <h2>Ready to accelerate your AI development?</h2>
                <p>Join leading AI teams using TagMaster labeling services</p>
                <div className="cta-actions">
                    <button className="btn-primary" onClick={() => navigate('/login')}>
                        Contact us
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/pricing')}>
                        View pricing
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Services;
