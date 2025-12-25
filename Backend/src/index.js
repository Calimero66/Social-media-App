import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import cors from 'cors';
import Routes from './routes/Routes.js';
import cookieParser from 'cookie-parser';
import { initializeSocket } from './socket/socketHandler.js';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Initialize socket handlers
initializeSocket(io);

// Make io accessible to routes
app.set('io', io);

app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/sma', Routes);

const PORT = process.env.PORT;

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
}

main();

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});