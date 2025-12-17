import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
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
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});


const Post = mongoose.model('Post', postSchema);
export default Post;