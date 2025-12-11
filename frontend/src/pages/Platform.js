import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Platform.css';

const Platform = () => {
    const navigate = useNavigate();

    return (
        <div className="platform-page">
            <nav className="platform-nav">
                <div className="nav-content">
                    <div className="nav-logo" onClick={() => navigate('/')}>
                        <h2>TagMaster</h2>
                    </div>
                    <button onClick={() => navigate('/')} className="nav-back">
                        Back to Home
                    </button>
                </div>
            </nav>

            <section className="platform-hero">
                <div className="hero-content">
                    <h1>The most complete data labeling platform</h1>
                    <p>Industry-leading data labeling software purpose-built to deliver the highest quality data for GenAI and task-specific models without compromising throughput or control</p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => navigate('/login')}>Contact us</button>
                        <button className="btn-secondary" onClick={() => navigate('/login')}>Start for free</button>
                    </div>
                </div>
                <div className="hero-visuals">
                    <div className="visual-card">
                        <div className="card-header"> Multimodal</div>
                        <p>Support for images, text, video, and audio annotations</p>
                    </div>
                    <div className="visual-card">
                        <div className="card-header"> Performance</div>
                        <p>Real-time analytics and quality metrics</p>
                    </div>
                    <div className="visual-card">
                        <div className="card-header"> Model Integration</div>
                        <p>Connect with 25+ ML frameworks</p>
                    </div>
                </div>
            </section>

            <section className="platform-section">
                <h2>For developers</h2>
                <p className="section-subtitle">The TagMaster platform integrates smoothly with existing pipelines via advanced APIs and SDKs</p>

                <div className="developer-grid">
                    <div className="dev-card">
                        <div className="dev-icon green"></div>
                        <h3>Python SDK & API</h3>
                        <p>Open-source projects automate actions and integrate into existing pipelines.</p>
                        <a href="#" className="card-link">Learn more →</a>
                    </div>

                    <div className="dev-card">
                        <div className="dev-icon orange"></div>
                        <h3>Integrations</h3>
                        <p>Import data from 25+ sources without writing any code, enjoy strong security.</p>
                        <a href="#" className="card-link">Learn more →</a>
                    </div>

                    <div className="dev-card">
                        <div className="dev-icon yellow"></div>
                        <h3>Tutorials</h3>
                        <p>Library of 50+ tutorials in Google Colab and Github to help you get started.</p>
                        <a href="#" className="card-link">Learn more →</a>
                    </div>
                </div>
            </section>

            <section className="platform-section alt-bg">
                <div className="section-split">
                    <div className="split-visual">
                        <div className="diagram-box">
                            <div className="workflow-step">
                                <span className="step-label">Data Input</span>
                                <div className="step-box">Raw annotations from team</div>
                            </div>
                            <div className="arrow">→</div>
                            <div className="workflow-step">
                                <span className="step-label">AI Processing</span>
                                <div className="step-box highlighted">Auto-validation & quality checks</div>
                            </div>
                            <div className="arrow">→</div>
                            <div className="workflow-step">
                                <span className="step-label">Output</span>
                                <div className="step-box">High-quality labeled data</div>
                            </div>
                        </div>
                    </div>
                    <div className="split-content">
                        <h2>Automation with built-in AI</h2>
                        <div className="feature-list">
                            <div className="feature-item">
                                <h4>Built-in code and grammar critics</h4>
                                <p>Reduce task time and improve quality using built-in code & grammar critics that auto-reviews data from AI trainers, ensuring accuracy & speed for your AI projects.</p>
                            </div>
                            <div className="feature-item">
                                <h4>Model-assisted labeling</h4>
                                <p>Use pre-loaded frontier models for powerful model-assisted labeling. Accelerate your data annotation and achieve higher quality outputs effortlessly.</p>
                            </div>
                            <div className="feature-item">
                                <h4>Native quality assurance</h4>
                                <p>Ensure top data quality with using built-in AI to perform auto-QA & easily include LLM-as-a-judge in your workflows through our graphical user interface.</p>
                            </div>
                        </div>
                        <a href="#" className="explore-link">Explore AI automation →</a>
                    </div>
                </div>
            </section>

            <section className="platform-section">
                <div className="section-split reverse">
                    <div className="split-content">
                        <h2>Built-in quality assurance</h2>
                        <div className="feature-list">
                            <div className="feature-item">
                                <h4>Real-time statistical analysis</h4>
                                <p>Track data quality in real-time using a robust scientific approach that uses precision and accuracy as two foundational pillars of ensuring the efficiency of your data labeling projects.</p>
                            </div>
                            <div className="feature-item">
                                <h4>Performance charts</h4>
                                <p>Monitor team performance with detailed analytics showing throughput, accuracy, and efficiency metrics across all your annotation projects.</p>
                            </div>
                        </div>
                    </div>
                    <div className="split-visual">
                        <div className="metrics-preview">
                            <div className="metric-item">
                                <div className="metric-label">Throughput</div>
                                <div className="metric-value">73,754</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-label">Efficiency</div>
                                <div className="metric-value">94.2%</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-label">Labels</div>
                                <div className="metric-value">73,234</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="platform-cta">
                <h2>Ready to get started?</h2>
                <p>Join thousands of teams using TagMaster to build better AI</p>
                <div className="cta-actions">
                    <button className="btn-primary" onClick={() => navigate('/login')}>Start for free</button>
                    <button className="btn-secondary" onClick={() => navigate('/pricing')}>View pricing</button>
                </div>
            </section>
        </div>
    );
};

export default Platform;
