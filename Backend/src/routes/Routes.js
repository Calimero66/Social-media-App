import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    protectedRoute, 
    getUser,
    getUseById
} from '../controllers/userController.js';
import { createPost, updatePost, deletePost , getAllPosts ,getPost , getPostsByAuthor, getMyPosts ,getTags ,getPostsByTag  } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/auth.js'; 
import { upload } from '../middleware/uploadMiddleware.js'; 
import { createComment, deleteComment, getCommentByPost, updateComment } from '../controllers/commentController.js';

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser', isAuthenticated, getUser);
router.get('/getUseById/:userId', getUseById);


// Protected route for testing
router.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'Accès autorisé' });
    console.log(req.user);
});

// Route for App posts
router.post('/createPost', isAuthenticated, upload.single("image"), createPost);
router.put('/updatePost/:postId', isAuthenticated, upload.single('image'), updatePost);
router.delete("/deletePost/:postId", isAuthenticated, deletePost);

// Route for find posts
router.get('/getMyPosts',isAuthenticated, getMyPosts);
router.get('/getTags', getTags);
router.get('/getPostsByTag', getPostsByTag); 
router.get('/getPost/:postId', getPost);
router.get('/allPosts', getAllPosts);
router.get('/getPostsByAuthor',isAuthenticated, getPostsByAuthor);

// Route for comments
router.post('/comment', isAuthenticated, createComment);
router.delete('/comment/:commentId', isAuthenticated, deleteComment);
router.put('/comment/:commentId', isAuthenticated, updateComment);
router.get('/comment/:postId', getCommentByPost);


// Authentication check
router.get('/isAuthenticated', isAuthenticated, protectedRoute);


export default router;
