import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Create socket connection
        const newSocket = io('http://localhost:8000', {
            withCredentials: true,
            autoConnect: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('online_users', (users) => {
            setOnlineUsers(users);
        });

        newSocket.on('user_online', ({ userId }) => {
            setOnlineUsers(prev => [...new Set([...prev, userId])]);
        });

        newSocket.on('user_offline', ({ userId }) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
        });

        newSocket.on('connect_error', (error) => {
            console.log('Socket connection error:', error.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, onlineUsers, isUserOnline }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
