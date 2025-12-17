import mongoose from 'mongoose';

const PostLikesSchema = new mongoose.Schema({
    post: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likedAt: {
        type: Date,
        default: Date.now
    }
});
const PostLikes = mongoose.model('PostLikes', PostLikesSchema);
export default PostLikes;