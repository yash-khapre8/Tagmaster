import React, { createContext, useState, useEffect, useContext } from 'react';
import socketService from '../services/socket';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { token, isAuthenticated } = useContext(AuthContext);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isAuthenticated && token) {
            const socketInstance = socketService.connect(token);
            setSocket(socketInstance);

            socketInstance.on('connect', () => {
                setConnected(true);
            });

            socketInstance.on('disconnect', () => {
                setConnected(false);
            });

            return () => {
                // Don't disconnect on unmount, only on logout
            };
        } else {
            if (socketService.isConnected()) {
                socketService.disconnect();
                setSocket(null);
                setConnected(false);
            }
        }
    }, [isAuthenticated, token]);

    const value = {
        socket,
        connected,
        socketService,
        isConnected: connected && socketService.isAuthenticated()
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
