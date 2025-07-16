const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); // Import the Blog model
const authenticate = require('../middleware/authMiddleware');
const authenticateSuperAdmin = require('../middleware/authSuperadminMiddleware');

// Define blog routes with logic directly embedded

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// GET a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// POST a new blog (using Base64 for image)
router.post('/',authenticateSuperAdmin, async (req, res) => {
  try {
    const { title, category, type, location, excerpt, content, image, cost, author, authorTitle, date, rating, pros, cons } = req.body;

    // Validate essential fields
    if (!title || !category || !location || !excerpt || !content) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // `pros` and `cons` are already arrays from the frontend's Zod transformation
    // Ensure they are treated as arrays, defaulting to empty array if undefined/null
    const prosArray = Array.isArray(pros) ? pros : [];
    const consArray = Array.isArray(cons) ? cons : [];

    const newBlog = new Blog({
      title,
      category,
      type,
      location,
      excerpt,
      content,
      image, // This is the Base64 string
      cost,
      author,
      authorTitle,
      date,
      rating: rating ? Number(rating) : 0, // Ensure rating is a number
      pros: prosArray,
      cons: consArray,
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully!', blog: newBlog });
  } catch (error) {
    // Handle Mongoose validation errors
    console.log(error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

// PUT (update) a blog by ID (using Base64 for image)
router.put('/:id',authenticateSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // `updateData.pros` and `updateData.cons` are already arrays from the frontend's Zod transformation
    // Ensure they are treated as arrays, defaulting to empty array if undefined/null
    if (updateData.pros !== undefined) {
      updateData.pros = Array.isArray(updateData.pros) ? updateData.pros : [];
    }
    if (updateData.cons !== undefined) {
      updateData.cons = Array.isArray(updateData.cons) ? updateData.cons : [];
    }

    // Ensure rating is converted to a number if present
    if (updateData.rating !== undefined) {
      updateData.rating = Number(updateData.rating);
    }

    // Find and update the blog document
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog updated successfully!', blog: updatedBlog });
  } catch (error) {
     console.log(error);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
});

// DELETE a blog by ID
router.delete('/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

module.exports = router;