import Post from "../models/post.js";
import Like from "../models/postlikes.js";

export const createPost = async (req, res) => {
    try {
        // console.log(req.user);
        const { content, tags } = req.body;

        const author = req.user.userId;
        if (!content) {
            return res.status(400).json({ message: "Content is required." });
        }
        if (!author) {
            return res.status(400).json({ error: 'Author information is missing' });
        }

        const filePath = req.file ? `/uploads/${req.file.filename}` : null;
        const isVideo = req.file && req.file.mimetype.startsWith('video/');
        
        const newPost = new Post({
            content,
            author,
            tags,
            image: isVideo ? null : filePath,
            video: isVideo ? filePath : null,
        });

        const savedPost = await newPost.save();

        // res.status(201).json(savedPost);
        res.status(201).json({ message: "Post created successfully", savedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create post.", error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, tags } = req.body;
        const userId = req.user.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this post." });
        }

        post.content = content || post.content;
        post.tags = tags || post.tags;
        
        // Handle new file upload
        if (req.file) {
            const filePath = `/uploads/${req.file.filename}`;
            const isVideo = req.file.mimetype.startsWith('video/');
            
            if (isVideo) {
                post.video = filePath;
                post.image = null;
            } else {
                post.image = filePath;
                post.video = null;
            }
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update post.", error: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(postId);
        console.log('hey this is post = ' + post);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post." });
        }

        await post.deleteOne({ _id: postId });
        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post.", error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const posts = await Post.find({ author: userId });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch your posts.", error: error.message });
    }
};

export const getPostsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ author: userId }).sort({ date: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch user posts.", error: error.message });
    }
};

// Get a single post
export const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        console.log("🚀 ~ getPost ~ post:", post)
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch post.", error: error.message });
    }
};

// Get posts by author
export const getPostsByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;
        const posts = await Post.find({ author: authorId });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
    }
};

// Get liked posts for current user
export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const likedPosts = await Like.find({ user: userId }).populate('post');
        const posts = likedPosts.map(like => like.post);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch liked posts.", error: error.message });
    }
};
