import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './Home.css';
import './LoginShapes.css';

const Home = () => {
    const navigate = useNavigate();
    const [showResourcesDropdown, setShowResourcesDropdown] = React.useState(false);
    const [showPlatformDropdown, setShowPlatformDropdown] = React.useState(false);

    return (
        <div className="home-page">
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

            {/* Navigation */}
            <nav className="home-nav">
                <div className="nav-content">
                    <div className="nav-logo">
                        <h2>TagMaster</h2>
                    </div>
                    <div className="nav-links">
                        <div
                            className="nav-dropdown"
                            onMouseEnter={() => setShowPlatformDropdown(true)}
                            onMouseLeave={() => setShowPlatformDropdown(false)}
                        >
                            <span className="nav-link-dropdown">Platform</span>
                            {showPlatformDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-content">
                                        <div className="dropdown-section">
                                            <h4>Platform</h4>
                                            <a onClick={() => navigate('/platform')}>Overview</a>
                                            <a href="#annotation-tools">Annotation tools</a>
                                            <a href="#automation">AI automation</a>
                                            <a href="#quality-assurance">Quality assurance</a>
                                            <a href="#integrations">Integrations</a>
                                            <a href="#python-sdk">Python SDK & API</a>
                                        </div>
                                        <div className="dropdown-featured">
                                            <h4>For Developers</h4>
                                            <div className="featured-card blue">
                                                <h5>Python SDK & API</h5>
                                                <p>Automate actions and integrate into existing pipelines</p>
                                                <span className="card-link">Learn more →</span>
                                            </div>
                                            <div className="featured-card yellow">
                                                <h5>Model Integrations</h5>
                                                <p>Import data from 25+ sources without writing code</p>
                                                <span className="card-link">Learn more →</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <a href="#solutions">Solutions</a>
                        <div
                            className="nav-dropdown"
                            onMouseEnter={() => setShowResourcesDropdown(true)}
                            onMouseLeave={() => setShowResourcesDropdown(false)}
                        >
                            <span className="nav-link-dropdown">Resources</span>
                            {showResourcesDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-content">
                                        <div className="dropdown-section">
                                            <h4>Resources</h4>
                                            <a href="#blog">Blog</a>
                                            <a href="#documentation">Documentation</a>
                                            <a href="#library">Library</a>
                                            <a href="#case-studies">Case studies</a>
                                            <a href="#education">Education</a>
                                            <a href="#careers">Careers</a>
                                        </div>
                                        <div className="dropdown-featured">
                                            <h4>Featured</h4>
                                            <div className="featured-card blue">
                                                <h5>Getting Started Guide</h5>
                                                <p>Learn how to set up your first annotation project</p>
                                                <span className="card-link">Read more →</span>
                                            </div>
                                            <div className="featured-card yellow">
                                                <h5>Best Practices</h5>
                                                <p>Tips for efficient team collaboration and quality control</p>
                                                <span className="card-link">Read more →</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span onClick={() => navigate('/pricing')} style={{ cursor: 'pointer' }}>Pricing</span>
                    </div>
                    <div className="nav-actions">
                        <button className="nav-login" onClick={() => navigate('/login')}>
                            Log in
                        </button>
                        <button className="nav-signup" onClick={() => navigate('/login')}>
                            Start for free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>The data factory for AI teams</h1>
                    <p>
                        TagMaster delivers innovative services and software to operate,
                        build, or staff your modern AI data factory
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => navigate('/login')}>
                            Take a tour
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/login')}>
                            Start for free
                        </button>
                    </div>
                </div>

                {/* Isometric illustration placeholder */}
                <div className="hero-illustration">
                    <div className="factory-container">
                        <div className="factory-building"></div>
                        <div className="conveyor-line"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-content">
                    <h2>Data factory for Frontier AI</h2>
                    <p className="features-subtitle">
                        AI teams depend on a powerful AI data factory to generate unique training data and evaluate models.
                        TagMaster is the only vendor with a comprehensive set of data solutions that can help you build,
                        operate, or staff your custom data factory.
                    </p>

                    <div className="features-grid">
                        {/* Services Card */}
                        <div className="feature-card">
                            <span className="feature-badge blue">Services</span>
                            <h3>Frontier data</h3>
                            <p>
                                TagMaster provides a fully managed solution for on-demand, high-quality labeled data and
                                human evaluations, powered by our exclusive network of Alignerrs.
                            </p>
                            <a onClick={() => navigate('/services')} className="feature-link" style={{ cursor: 'pointer' }}>
                                Discover labeling services →
                            </a>
                        </div>

                        {/* Platform Card */}
                        <div className="feature-card">
                            <span className="feature-badge orange">Software</span>
                            <h3>Platform & tools</h3>
                            <p>
                                For companies seeking full control over data labeling operations, harness our best-in-class
                                software to evaluate models, enhance data and generate high-quality data faster.
                            </p>
                            <a onClick={() => navigate('/platform')} className="feature-link" style={{ cursor: 'pointer' }}>
                                Explore the platform →
                            </a>
                        </div>
                    </div>

                    <div className="features-cta">
                        <button className="discover-btn" onClick={() => navigate('/login')}>
                            Discover the TagMaster difference →
                        </button>
                    </div>
                </div>
            </section>

            {/* AI Breakthroughs Section */}
            <section className="breakthroughs-section">
                <div className="breakthroughs-content">
                    <h2>Achieve AI breakthroughs with the most innovative post-training alignment</h2>
                    <p className="breakthroughs-subtitle">Data for reinforcement learning</p>

                    <div className="breakthroughs-grid">
                        {/* Left side - Features */}
                        <div className="breakthroughs-features">
                            <div className="breakthrough-item">
                                <h3>RLVR (Reinforcement learning from verifiable rewards)</h3>
                                <p>
                                    Providing clean, automatic reward signals for tasks like math, code, or form completion
                                    where correctness can be programmatically verified.
                                </p>
                            </div>

                            <div className="breakthrough-item">
                                <h3>Rubric-based evals</h3>
                                <p>
                                    Enabling fine-grained feedback on subjective tasks by scoring outputs against
                                    human-defined criteria like clarity or helpfulness.
                                </p>
                            </div>

                            <div className="breakthrough-item">
                                <h3>Solvers and verifiers</h3>
                                <p>
                                    Delivering automated checks to solve or validate complex, multi-step outputs for
                                    higher-quality supervision.
                                </p>
                            </div>
                        </div>

                        {/* Right side - Diagram */}
                        <div className="breakthroughs-diagram">
                            <div className="diagram-container">
                                <div className="diagram-flow">
                                    <div className="flow-item">
                                        <span className="flow-label">DATA PLATFORM</span>
                                        <div className="flow-box">
                                            <strong>TagMaster</strong>
                                            <p>Hybrid data labeling platform & operations</p>
                                        </div>
                                    </div>

                                    <div className="flow-arrows">→</div>

                                    <div className="flow-item">
                                        <span className="flow-label">NETWORK</span>
                                        <div className="flow-box">
                                            <strong>Alignerr</strong>
                                            <p>70+ countries, fastest growing expert network. Native AI interviews and assessment</p>
                                        </div>
                                    </div>

                                    <div className="flow-arrows">→</div>

                                    <div className="flow-result">
                                        <div className="result-box">
                                            <strong>Novel data generation</strong>
                                            <p>and expert eval, guided by applied insights</p>
                                        </div>

                                        <div className="result-box">
                                            <strong>Frontier data</strong>
                                            <p>optimized for cost, quality, and turnaround</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company logos */}
            <section className="partners-section">
                <div className="partners-grid">
                    <div className="partner-logo">Walmart</div>
                    <div className="partner-logo">Genentech</div>
                    <div className="partner-logo">P&G</div>
                    <div className="partner-logo">Seek</div>
                    <div className="partner-logo">Eleven Labs</div>
                    <div className="partner-logo">Shutterstock</div>
                    <div className="partner-logo">Ideogram</div>
                    <div className="partner-logo">Stryker</div>
                    <div className="partner-logo">Intuitive</div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
