import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    protectedRoute, 
    getUser,
    getUseById,
    updateProfile,
    updateProfileImage,
    getAllUsers
} from '../controllers/userController.js';
import { createPost, updatePost, deletePost , getAllPosts ,getPost , getPostsByAuthor, getMyPosts , getPostsByUserId, getLikedPosts  } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/auth.js'; 
import { upload } from '../middleware/uploadMiddleware.js'; 
import { createComment, deleteComment, getCommentByPost, updateComment } from '../controllers/commentController.js';
import { likePost, getLikesCount, checkUserLiked } from '../controllers/likesController.js';
import { followUser, unfollowUser, checkFollowing, getFollowers, getFollowing, getFollowStats } from '../controllers/followController.js';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';
import { savePost, unsavePost, getSavedPosts, checkSaved } from '../controllers/savedPostController.js';
import { 
    getOrCreateConversation, 
    getConversations, 
    getMessages, 
    sendMessage, 
    markMessagesAsRead, 
    getUnreadMessagesCount,
    deleteMessage 
} from '../controllers/chatController.js';

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser', isAuthenticated, getUser);
router.get('/getUseById/:userId', getUseById);
router.put('/updateProfile', isAuthenticated, updateProfile);
router.put('/updateProfileImage', isAuthenticated, upload.single('profileImage'), updateProfileImage);
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

// Route for notifications
router.get('/notifications', isAuthenticated, getNotifications);
router.get('/notifications/unread-count', isAuthenticated, getUnreadCount);
router.put('/notifications/:notificationId/read', isAuthenticated, markAsRead);
router.put('/notifications/mark-all-read', isAuthenticated, markAllAsRead);
router.delete('/notifications/:notificationId', isAuthenticated, deleteNotification);

// Route for saved posts
router.post('/savePost/:postId', isAuthenticated, savePost);
router.post('/unsavePost/:postId', isAuthenticated, unsavePost);
router.get('/savedPosts', isAuthenticated, getSavedPosts);
router.get('/checkSaved/:postId', isAuthenticated, checkSaved);

// Route for chat/messages
router.get('/conversations', isAuthenticated, getConversations);
router.get('/conversation/:recipientId', isAuthenticated, getOrCreateConversation);
router.get('/messages/unread/count', isAuthenticated, getUnreadMessagesCount);
router.get('/messages/:conversationId', isAuthenticated, getMessages);
router.post('/messages/:conversationId', isAuthenticated, sendMessage);
router.put('/messages/:conversationId/read', isAuthenticated, markMessagesAsRead);
router.delete('/messages/:messageId', isAuthenticated, deleteMessage);

// Authentication check
router.get('/isAuthenticated', isAuthenticated, protectedRoute);


export default router;
