import Post from "../models/post.js";

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
        const { content, tags, image } = req.body;
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
        post.image = image || post.image;

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
        // res.status(200).json({ message: "Post updated successfully", updatedPost });
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

export const getTags = async (req, res) => {
    try {
        const tagsPost = await Post.find({}, 'tags');
        // console.log("🚀 ~ tagsPost:", tagsPost);

         // Extract tags from all posts and flatten the array
        const allTags = tagsPost.reduce((acc, post) =>{
            return [...acc, ...(JSON.parse(post.tags) || [])]}, []);

        const uniqueTags = [...new Set(allTags)];
        res.status(200).json(uniqueTags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
    }
};

export const getPostsByTag = async (req, res) => {
    try {
        let tag = req.query.tag; // Get tag from query params

        if (!tag) {
            return res.status(400).json({ message: "Tag parameter is required" });
        }

        tag = String(tag); // Ensure tag is a string

        const posts = await Post.find({
            tags: { $regex: new RegExp(tag, "i") } // Case-insensitive regex search
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts by tag:", error);
        res.status(500).json({ message: "Failed to fetch posts by tag.", error: error.message });
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
