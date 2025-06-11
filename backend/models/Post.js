const mongoose = require('mongoose');

// Define the ReplySchema first
const ReplySchema = new mongoose.Schema({
    user: { // Reference to the User who made the reply
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    author: { // Store the username/name of the replier directly for easy access
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// After defining the initial ReplySchema, make it recursive
// This allows a 'replies' array within a ReplySchema itself
ReplySchema.add({
    replies: [ReplySchema] // This makes it recursive: a reply can have replies
});


const PostSchema = new mongoose.Schema({
    user: { // Reference to the User who created the post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // Replies to the main post are an array of ReplySchema documents
    replies: [ReplySchema],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);