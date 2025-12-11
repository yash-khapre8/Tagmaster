import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
    const navigate = useNavigate();

    const features = [
        {
            category: 'Platform Features',
            items: [
                { name: 'Core annotation tools', free: true, pro: true, enterprise: true },
                { name: 'Users', free: 'Up to 5', pro: 'Unlimited', enterprise: 'Unlimited' },
                { name: 'Projects', free: 'Up to 10', pro: 'Unlimited', enterprise: 'Unlimited' },
                { name: 'Storage', free: '1GB', pro: '50GB', enterprise: 'Unlimited' },
                { name: 'Real-time collaboration', free: false, pro: true, enterprise: true },
            ]
        },
        {
            category: 'Annotation Tools',
            items: [
                { name: 'Bounding boxes', free: true, pro: true, enterprise: true },
                { name: 'Polygons & shapes', free: true, pro: true, enterprise: true },
                { name: 'Text annotations', free: true, pro: true, enterprise: true },
                { name: 'Custom annotation types', free: false, pro: true, enterprise: true },
                { name: 'AI-assisted labeling', free: false, pro: true, enterprise: true },
            ]
        },
        {
            category: 'Collaboration',
            items: [
                { name: 'Multi-user workspace', free: '1', pro: 'Unlimited', enterprise: 'Unlimited' },
                { name: 'Review workflows', free: false, pro: true, enterprise: true },
                { name: 'Performance metrics', free: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
                { name: 'Activity tracking', free: false, pro: true, enterprise: true },
            ]
        },
        {
            category: 'Support & Security',
            items: [
                { name: 'Support', free: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
                { name: 'SSO & SAML', free: false, pro: false, enterprise: true },
                { name: 'Custom integrations', free: false, pro: false, enterprise: true },
                { name: 'SLA guarantee', free: false, pro: false, enterprise: true },
            ]
        }
    ];

    const renderValue = (value) => {
        if (typeof value === 'boolean') {
            return value ? '✓' : '—';
        }
        return value;
    };

    return (
        <div className="pricing-page">
            <nav className="pricing-nav">
                <div className="nav-content">
                    <div className="nav-logo" onClick={() => navigate('/')}>
                        <h2>TagMaster</h2>
                    </div>
                    <button onClick={() => navigate('/')} className="nav-back">
                        Back to Home
                    </button>
                </div>
            </nav>

            <div className="pricing-hero">
                <h1>Simple, transparent pricing</h1>
                <p>Choose the plan that fits your team's needs</p>
            </div>

            <div className="pricing-content">
                <div className="pricing-cards">
                    <div className="price-card">
                        <div className="card-header">
                            <h3>Free</h3>
                            <div className="price">
                                <span className="amount">$0</span>
                                <span className="period">/month</span>
                            </div>
                        </div>
                        <p className="card-description">Perfect for individuals and small teams getting started</p>
                        <button className="card-button secondary" onClick={() => navigate('/login')}>
                            Get Started
                        </button>
                    </div>

                    <div className="price-card featured">
                        <div className="featured-badge">Most Popular</div>
                        <div className="card-header">
                            <h3>Professional</h3>
                            <div className="price">
                                <span className="amount">$49</span>
                                <span className="period">/month</span>
                            </div>
                        </div>
                        <p className="card-description">For growing teams that need advanced features</p>
                        <button className="card-button primary" onClick={() => navigate('/login')}>
                            Start Free Trial
                        </button>
                    </div>

                    <div className="price-card">
                        <div className="card-header">
                            <h3>Enterprise</h3>
                            <div className="price">
                                <span className="amount">Custom</span>
                            </div>
                        </div>
                        <p className="card-description">For large organizations with custom requirements</p>
                        <button className="card-button secondary" onClick={() => navigate('/login')}>
                            Contact Sales
                        </button>
                    </div>
                </div>

                <div className="feature-comparison">
                    <h2>Platform features</h2>

                    <div className="comparison-table">
                        <div className="table-header">
                            <div className="feature-col">Features</div>
                            <div className="tier-col">Free</div>
                            <div className="tier-col">Professional</div>
                            <div className="tier-col">Enterprise</div>
                        </div>

                        {features.map((section, idx) => (
                            <div key={idx} className="feature-section">
                                <div className="section-header">{section.category}</div>
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="feature-row">
                                        <div className="feature-name">{item.name}</div>
                                        <div className="feature-value">{renderValue(item.free)}</div>
                                        <div className="feature-value">{renderValue(item.pro)}</div>
                                        <div className="feature-value">{renderValue(item.enterprise)}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
