import jwt from 'jsonwebtoken';
import Message from '../models/message.js';
import Conversation from '../models/conversation.js';

// Store online users: { odUserId: socketId }
const onlineUsers = new Map();

// Helper function to parse cookies from cookie string
const parseCookies = (cookieString) => {
    const cookies = {};
    if (cookieString) {
        cookieString.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cookies[name] = value;
            }
        });
    }
    return cookies;
};

export const initializeSocket = (io) => {
    // Middleware to authenticate socket connections
    io.use((socket, next) => {
        // Try to get token from auth or from cookies
        let token = socket.handshake.auth.token;

        if (!token && socket.handshake.headers.cookie) {
            const cookies = parseCookies(socket.handshake.headers.cookie);
            token = cookies.token;
        }

        if (!token) {
            console.log('Socket auth: No token provided');
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            socket.userId = decoded.userId;
            next();
        } catch (err) {
            console.log('Socket auth: Invalid token', err.message);
            return next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Add user to online users
        onlineUsers.set(socket.userId, socket.id);

        // Broadcast online status to all users
        io.emit('user_online', { userId: socket.userId });

        // Send current online users to the newly connected user
        socket.emit('online_users', Array.from(onlineUsers.keys()));

        // Handle joining a conversation room
        socket.on('join_conversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        });

        // Handle leaving a conversation room
        socket.on('leave_conversation', (conversationId) => {
            socket.leave(conversationId);
            console.log(`User ${socket.userId} left conversation ${conversationId}`);
        });

        // Handle sending a message
        socket.on('send_message', async (data) => {
            try {
                const { conversationId, content, receiverId } = data;

                // Create the message
                const message = new Message({
                    sender: socket.userId,
                    receiver: receiverId,
                    content: content.trim()
                });
                await message.save();

                // Update conversation's last message
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: message._id,
                    updatedAt: new Date()
                });

                // Populate the message
                const populatedMessage = await Message.findById(message._id)
                    .populate('sender', 'username profileImage')
                    .populate('receiver', 'username profileImage');

                // Emit to the conversation room
                io.to(conversationId).emit('new_message', populatedMessage);

                // If receiver is online but not in the room, send notification
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message_notification', {
                        conversationId,
                        message: populatedMessage
                    });
                }
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            const { conversationId, isTyping } = data;
            socket.to(conversationId).emit('user_typing', {
                userId: socket.userId,
                isTyping
            });
        });

        // Handle marking messages as read
        socket.on('mark_read', async (data) => {
            try {
                const { conversationId, senderId } = data;

                await Message.updateMany(
                    {
                        receiver: socket.userId,
                        sender: senderId,
                        read: false
                    },
                    { read: true }
                );

                // Notify the sender that messages were read
                const senderSocketId = onlineUsers.get(senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messages_read', {
                        conversationId,
                        readBy: socket.userId
                    });
                }
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
            onlineUsers.delete(socket.userId);
            io.emit('user_offline', { userId: socket.userId });
        });
    });
};

export { onlineUsers };
