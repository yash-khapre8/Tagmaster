import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.authenticated = false;
    }

    connect(token) {
        if (this.socket && this.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Connection events
        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.connected = true;

            // Authenticate with token
            if (token) {
                this.socket.emit('authenticate', token);
            }
        });

        this.socket.on('authenticated', (data) => {
            console.log('Socket authenticated:', data.user);
            this.authenticated = true;
        });

        this.socket.on('auth_error', (error) => {
            console.error('Socket auth error:', error);
            this.authenticated = false;
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.connected = false;
            this.authenticated = false;
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');

            // Re-authenticate on reconnect
            const token = localStorage.getItem('token');
            if (token) {
                this.socket.emit('authenticate', token);
            }
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.authenticated = false;
        }
    }

    // Asset events
    claimAsset(assetId, callback) {
        if (this.socket && this.authenticated) {
            this.socket.emit('claim_asset', { assetId });
            if (callback) {
                this.socket.once('asset_claimed', callback);
            }
        }
    }

    releaseAsset(assetId, callback) {
        if (this.socket && this.authenticated) {
            this.socket.emit('release_asset', { assetId });
            if (callback) {
                this.socket.once('asset_released', callback);
            }
        }
    }

    completeAsset(assetId, callback) {
        if (this.socket && this.authenticated) {
            this.socket.emit('complete_asset', { assetId });
            if (callback) {
                this.socket.once('asset_completed', callback);
            }
        }
    }

    // Annotation events
    createAnnotation(assetId, annotationData, callback) {
        if (this.socket && this.authenticated) {
            this.socket.emit('create_annotation', { assetId, annotationData });
            if (callback) {
                this.socket.once('annotation_created', callback);
            }
        }
    }

    updateAnnotation(annotationId, updates, callback) {
        if (this.socket && this.authenticated) {
            this.socket.emit('update_annotation', { annotationId, updates });
            if (callback) {
                this.socket.once('annotation_updated', callback);
            }
        }
    }

    deleteAnnotation(annotationId, assetId, callback) {
        if (this.socket && this.authenticated) {
            this.socket.emit('delete_annotation', { annotationId, assetId });
            if (callback) {
                this.socket.once('annotation_deleted', callback);
            }
        }
    }

    // Room management
    joinAsset(assetId) {
        if (this.socket && this.authenticated) {
            this.socket.emit('join_asset', { assetId });
        }
    }

    leaveAsset(assetId) {
        if (this.socket && this.authenticated) {
            this.socket.emit('leave_asset', { assetId });
        }
    }

    // Cursor tracking
    sendCursorMove(assetId, position) {
        if (this.socket && this.authenticated) {
            this.socket.emit('cursor_move', { assetId, position });
        }
    }

    // Event listeners
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    once(event, callback) {
        if (this.socket) {
            this.socket.once(event, callback);
        }
    }

    getSocket() {
        return this.socket;
    }

    isConnected() {
        return this.connected;
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

const socketService = new SocketService();
export default socketService;
