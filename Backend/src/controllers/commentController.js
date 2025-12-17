import Comment from "../models/comment.js";

export const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const user = req.user.userId;
        const { post } = req.query;
        
        console.log("🚀 ~ createComment ~ content:", content)
        console.log("🚀 ~ createComment ~ postId:", post)

        if (!content) {
            return res.status(400).json({ message: "Content is required." });
        }

        const newComment = new Comment({
            content,
            user,
            post,
        });

        const savedComment = await newComment.save();
        res.status(201).json({ message: "Comment created successfully", savedComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create comment.", error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        if (comment.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this comment." });
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete comment.", error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        if (comment.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to update this comment." });
        }
        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
        res.status(200).json({ message: "Comment updated successfully.", updatedComment });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update comment.", error: error.message });
    }
};

export const getCommentByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        console.log("🚀 ~ getCommentByPost ~ post:", postId)

        const comments = await Comment.find({ post: postId }).populate("user", "username");
        console.log("🚀 ~ getCommentByPost ~ comments:", comments)

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch comments.", error: error.message });
    }
};
