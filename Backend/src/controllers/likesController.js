import Post from "../models/post.js";
import Like from "../models/postlikes.js";

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const existingLike = await Like.findOne({ post: postId, user: userId });
        if (existingLike) {
            await existingLike.deleteOne();
            const likesCount = await Like.countDocuments({ post: postId });
            return res.status(200).json({ message: "Post unliked successfully.", liked: false, likesCount });
        } else {
            const newLike = new Like({
                post: postId,
                user: userId,
            });
            await newLike.save();
            const likesCount = await Like.countDocuments({ post: postId });
            res.status(201).json({ message: "Post liked successfully.", liked: true, likesCount });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to like post.", error: error.message });
    }
};

export const getLikesCount = async (req, res) => {
    try {
        const { postId } = req.params;
        const likesCount = await Like.countDocuments({ post: postId });
        res.status(200).json({ likesCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get likes count.", error: error.message });
    }
};

export const checkUserLiked = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;
        const existingLike = await Like.findOne({ post: postId, user: userId });
        res.status(200).json({ liked: !!existingLike });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check like status.", error: error.message });
    }
};