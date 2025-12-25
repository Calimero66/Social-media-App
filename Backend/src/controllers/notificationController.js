import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'username profileImage')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get notifications." });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const count = await Notification.countDocuments({ 
            recipient: userId, 
            read: false 
        });

        res.status(200).json({ unreadCount: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get unread count." });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark notification as read." });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        res.status(200).json({ message: "All notifications marked as read." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark all as read." });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        res.status(200).json({ message: "Notification deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete notification." });
    }
};

export const createNotification = async (recipientId, senderId, type, message, relatedPost = null) => {
    try {
        // Don't create notification if sender is the recipient
        if (recipientId.toString() === senderId.toString()) {
            return null;
        }

        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            type,
            message,
            relatedPost
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};
