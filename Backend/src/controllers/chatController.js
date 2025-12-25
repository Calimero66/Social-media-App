import Message from '../models/message.js';
import Conversation from '../models/conversation.js';
import User from '../models/user.js';

// Get or create a conversation between two users
export const getOrCreateConversation = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const userId = req.user.userId;

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, recipientId] }
        }).populate('participants', 'username profileImage')
          .populate('lastMessage');

        // Create new conversation if it doesn't exist
        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, recipientId]
            });
            await conversation.save();
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'username profileImage')
                .populate('lastMessage');
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error getting/creating conversation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all conversations for a user
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.userId;

        const conversations = await Conversation.find({
            participants: userId
        })
        .populate('participants', 'username profileImage')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

        // Get unread count for each conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    sender: { $ne: userId },
                    receiver: userId,
                    read: false,
                    $or: [
                        { sender: conv.participants[0]._id, receiver: conv.participants[1]._id },
                        { sender: conv.participants[1]._id, receiver: conv.participants[0]._id }
                    ]
                });
                return {
                    ...conv.toObject(),
                    unreadCount
                };
            })
        );

        res.status(200).json(conversationsWithUnread);
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.userId;
        const { page = 1, limit = 50 } = req.query;

        // Verify user is part of the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const [participant1, participant2] = conversation.participants;

        const messages = await Message.find({
            $or: [
                { sender: participant1, receiver: participant2 },
                { sender: participant2, receiver: participant1 }
            ]
        })
        .populate('sender', 'username profileImage')
        .populate('receiver', 'username profileImage')
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        // Verify user is part of the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Get the other participant (receiver)
        const receiverId = conversation.participants.find(
            p => p.toString() !== userId
        );

        // Create the message
        const message = new Message({
            sender: userId,
            receiver: receiverId,
            content: content.trim()
        });
        await message.save();

        // Update conversation's last message
        conversation.lastMessage = message._id;
        conversation.updatedAt = new Date();
        await conversation.save();

        // Populate and return the message
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username profileImage')
            .populate('receiver', 'username profileImage');

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.userId;

        // Verify user is part of the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Mark all messages from the other user as read
        await Message.updateMany(
            {
                receiver: userId,
                sender: { $in: conversation.participants.filter(p => p.toString() !== userId) },
                read: false
            },
            { read: true }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get total unread messages count
export const getUnreadMessagesCount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const unreadCount = await Message.countDocuments({
            receiver: userId,
            read: false
        });

        res.status(200).json({ unreadCount });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own messages' });
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
