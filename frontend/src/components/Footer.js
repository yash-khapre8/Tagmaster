import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-columns">
                    {/* Platform Column */}
                    <div className="footer-column">
                        <h3>Platform</h3>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#real-time">Real-time Collaboration</a></li>
                            <li><a href="#annotation">Annotation Tools</a></li>
                            <li><a href="#workflows">ML Workflows</a></li>
                            <li><a href="#integrations">Integrations</a></li>
                        </ul>
                    </div>

                    {/* Solutions Column */}
                    <div className="footer-column">
                        <h3>Solutions</h3>
                        <ul>
                            <li><a href="#computer-vision">Computer Vision</a></li>
                            <li><a href="#nlp">Natural Language</a></li>
                            <li><a href="#data-labeling">Data Labeling</a></li>
                            <li><a href="#quality-control">Quality Control</a></li>
                            <li><a href="#model-training">Model Training</a></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="footer-column">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="#docs">Documentation</a></li>
                            <li><a href="#api">API Reference</a></li>
                            <li><a href="#guides">Guides</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#support">Support</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className="footer-column">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#press">Press Kit</a></li>
                            <li><a href="#partners">Partners</a></li>
                        </ul>
                    </div>

                    {/* Social Column */}
                    <div className="footer-column">
                        <h3>Follow us</h3>
                        <div className="social-icons">
                            <a href="www.linkedin.com/in/-yash" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="https://github.com/yash-khapre8" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="https://github.com/yash-khapre8" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <FaGithub />
                            </a>
                            <a href="https://instagram.com/yash_.k8" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-bottom-left">
                        <p>© TagMaster, Inc</p>
                        <span className="footer-tagline">We enable breakthroughs</span>
                    </div>
                    <div className="footer-bottom-right">
                        <a href="#terms">Terms of Service</a>
                        <a href="#privacy">Privacy Notice</a>
                        <a href="#copyright">Copyright Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
