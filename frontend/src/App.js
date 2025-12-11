import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AnnotationProvider } from './context/AnnotationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ToastNotification from './components/ToastNotification';
import Home from './pages/Home';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Platform from './pages/Platform';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import AnnotationWorkspace from './pages/AnnotationWorkspace';
import Metrics from './pages/Metrics';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <SocketProvider>
                    <AnnotationProvider>
                        <Router>
                            <ToastNotification />
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/platform" element={<Platform />} />
                                <Route path="/services" element={<Services />} />

                                {/* Protected routes */}
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/workspace/:assetId"
                                    element={
                                        <ProtectedRoute>
                                            <AnnotationWorkspace />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/metrics"
                                    element={
                                        <ProtectedRoute>
                                            <Metrics />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute>
                                            <AdminPanel />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Catch all */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Router>
                    </AnnotationProvider>
                </SocketProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
