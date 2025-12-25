import User from "../models/user.js";
import Post from "../models/post.js";

export const savePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const user = await User.findById(userId);

        // Check if already saved
        if (user.savedPosts.includes(postId)) {
            return res.status(400).json({ message: "Post already saved." });
        }

        user.savedPosts.push(postId);
        await user.save();

        res.status(200).json({ message: "Post saved successfully.", saved: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to save post.", error: error.message });
    }
};

export const unsavePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const user = await User.findById(userId);

        // Check if post is saved
        if (!user.savedPosts.includes(postId)) {
            return res.status(400).json({ message: "Post is not saved." });
        }

        user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
        await user.save();

        res.status(200).json({ message: "Post unsaved successfully.", saved: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to unsave post.", error: error.message });
    }
};

export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).populate({
            path: 'savedPosts',
            populate: {
                path: 'author',
                select: 'username profileImage'
            }
        });

        // Filter out any null posts (deleted posts)
        const savedPosts = user.savedPosts.filter(post => post !== null);

        res.status(200).json(savedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get saved posts.", error: error.message });
    }
};

export const checkSaved = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        const isSaved = user.savedPosts.includes(postId);

        res.status(200).json({ saved: isSaved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check saved status.", error: error.message });
    }
};
