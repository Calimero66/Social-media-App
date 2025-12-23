import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: false
    },
    video: {
        type: String,
        required: false
    }
});


const Post = mongoose.model('Post', postSchema);
export default Post;