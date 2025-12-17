import Post from "../models/post";
import Like from "../models/like";

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

            return res.status(201).json({ message: "You have already liked this post." });
        }else {
            
            const newLike = new Like({
                post: postId,
                user: userId,
            });
            await newLike.save();
            res.status(201).json({ message: "Post liked successfully." });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to like post.", error: error.message });
    }
};