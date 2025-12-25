import User from "../models/user.js";
import { createNotification } from "./notificationController.js";

export const followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId;

        // Check if trying to follow self
        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const userToFollow = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if already following
        if (currentUser.following.includes(userId)) {
            return res.status(400).json({ message: "You already follow this user." });
        }

        // Add to following list
        currentUser.following.push(userId);
        await currentUser.save();

        // Add to followers list
        userToFollow.followers.push(currentUserId);
        await userToFollow.save();

        // Create notification for the followed user
        await createNotification(
            userId,
            currentUserId,
            'follow',
            `${currentUser.username} started following you`
        );

        res.status(200).json({ 
            message: "User followed successfully.", 
            following: true 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to follow user.", error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId;

        const userToUnfollow = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if following
        if (!currentUser.following.includes(userId)) {
            return res.status(400).json({ message: "You don't follow this user." });
        }

        // Remove from following list
        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        await currentUser.save();

        // Remove from followers list
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUserId);
        await userToUnfollow.save();

        res.status(200).json({ 
            message: "User unfollowed successfully.", 
            following: false 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to unfollow user.", error: error.message });
    }
};

export const checkFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId;

        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const isFollowing = currentUser.following.includes(userId);

        res.status(200).json({ following: isFollowing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check following status.", error: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('followers', 'username email');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user.followers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch followers.", error: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('following', 'username email');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user.following);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch following.", error: error.message });
    }
};

export const getFollowStats = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            followersCount: user.followers.length,
            followingCount: user.following.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch follow stats.", error: error.message });
    }
};
