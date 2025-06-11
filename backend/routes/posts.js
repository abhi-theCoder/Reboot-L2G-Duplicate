const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Superadmin = require('../models/Superadmin');
const Agent = require('../models/Agent');

function selectModel(role){
    if(role === 'superadmin') {
        return Superadmin;
    } else if(role === 'agent') {
        return Agent;
    } else {
        return Customer;
    }
}

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error Occurred while authenticating:",error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

router.post('/', authenticate, async (req, res) => {
    const { title, category, content, role } = req.body;

    let user;

    try {
        let selectedModel = selectModel(role);
        // console.log(selectedModel)
        user = await selectedModel.findById(req.user.id).select('-password');
        // console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'Authenticated user not found' });
        }

        const newPost = new Post({
            user: req.user.id,
            author: user.name, 
            title,
            category,
            content,
            replies: [] 
        });

        const post = await newPost.save();
        res.status(201).json(post);

    } catch (err) {
        console.log(err)
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/:id/toggle-like', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const isLiked = post.likedBy.includes(req.user.id);

        if (isLiked) {
            post.likes = Math.max(0, post.likes - 1);
            post.likedBy = post.likedBy.filter(
                (userId) => userId.toString() !== req.user.id
            );
        } else {
            post.likes += 1;
            post.likedBy.push(req.user.id);
        }

        await post.save();
        res.json({ likes: post.likes });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/:id/reply', authenticate, async (req, res) => {
    const { replyContent, role } = req.body;

    if (!replyContent || replyContent.trim() === '') {
        return res.status(400).json({ error: 'Reply content cannot be empty' });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        let selectedModel = selectModel(role);
        const user = await selectedModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Authenticated user not found' });
        }

        const newReply = {
            user: req.user.id,
            author: user.name,
            content: replyContent,
            date: new Date(),
            replies: []
        };

        post.replies.unshift(newReply);

        await post.save();

        res.json({
            message: 'Reply added successfully',
            reply: newReply
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/:postId/replies/:replyId', authenticate, async (req, res) => {
    const { replyContent, role } = req.body;
    const { postId, replyId } = req.params;

    if (!replyContent || replyContent.trim() === '') {
        return res.status(400).json({ error: 'Reply content cannot be empty' });
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        let selectedModel = selectModel(role); 
        const user = await selectedModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Authenticated user not found' });
        }

        const newSubReply = {
            user: req.user.id,
            author: user.name,
            content: replyContent,
            date: new Date(),
            replies: [] 
        };

        // Recursive function to find the parent reply and add the sub-reply
        // It returns true if the reply was found and added, false otherwise.
        const findAndAddReply = (repliesArray, targetReplyId, newReplyData) => {
            for (let i = 0; i < repliesArray.length; i++) {
                const reply = repliesArray[i];

                if (reply._id.toString() === targetReplyId) {
                    reply.replies.unshift(newReplyData);
                    return true;
                }

                if (reply.replies && reply.replies.length > 0) {
                    if (findAndAddReply(reply.replies, targetReplyId, newReplyData)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const replyFoundAndAdded = findAndAddReply(post.replies, replyId, newSubReply);

        if (!replyFoundAndAdded) {
            return res.status(404).json({ error: 'Parent reply not found in the post' });
        }

        await post.save();

        res.json({
            message: 'Sub-reply added successfully',
            reply: newSubReply
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
