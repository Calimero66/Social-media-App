import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    protectedRoute, 
    getUser,
    getUseById,
    updateProfile,
    getAllUsers
} from '../controllers/userController.js';
import { createPost, updatePost, deletePost , getAllPosts ,getPost , getPostsByAuthor, getMyPosts , getPostsByUserId, getLikedPosts  } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/auth.js'; 
import { upload } from '../middleware/uploadMiddleware.js'; 
import { createComment, deleteComment, getCommentByPost, updateComment } from '../controllers/commentController.js';
import { likePost, getLikesCount, checkUserLiked } from '../controllers/likesController.js';
import { followUser, unfollowUser, checkFollowing, getFollowers, getFollowing, getFollowStats } from '../controllers/followController.js';

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser', isAuthenticated, getUser);
router.get('/getUseById/:userId', getUseById);
router.put('/updateProfile', isAuthenticated, updateProfile);
router.get('/allUsers', getAllUsers);


// Protected route for testing
router.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'Accès autorisé' });
    console.log(req.user);
});

// Route for App posts
router.post('/createPost', isAuthenticated, upload.single("image"), createPost);
router.put('/updatePost/:postId', isAuthenticated, upload.single('image'), updatePost);
router.delete("/deletePost/:postId", isAuthenticated, deletePost);

// Route for likes
router.post("/likePost/:postId", isAuthenticated, likePost);
router.get("/likesCount/:postId", getLikesCount);
router.get("/checkLiked/:postId", isAuthenticated, checkUserLiked);

// Route for find posts
router.get('/getMyPosts',isAuthenticated, getMyPosts);
router.get('/getLikedPosts',isAuthenticated, getLikedPosts);
router.get('/getPost/:postId', getPost);
router.get('/allPosts', getAllPosts);
router.get('/getPostsByAuthor',isAuthenticated, getPostsByAuthor);
router.get('/getPostsByUserId/:userId', getPostsByUserId);

// Route for comments
router.post('/comment', isAuthenticated, createComment);
router.delete('/comment/:commentId', isAuthenticated, deleteComment);
router.put('/comment/:commentId', isAuthenticated, updateComment);
router.get('/comment/:postId', getCommentByPost);

// Route for follow/following
router.post('/follow/:userId', isAuthenticated, followUser);
router.post('/unfollow/:userId', isAuthenticated, unfollowUser);
router.get('/checkFollowing/:userId', isAuthenticated, checkFollowing);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.get('/followStats/:userId', getFollowStats);

// Authentication check
router.get('/isAuthenticated', isAuthenticated, protectedRoute);


export default router;
