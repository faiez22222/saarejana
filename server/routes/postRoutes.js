const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose')
const Post = require('../models/post');
const FriendRequest = require('../models/firendRequest')
const Friend = require('../models/Friend')

// Set up the multer storage for images and videos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, './client/public/upload/images');
    } else if (file.fieldname === 'video') {
      cb(null, './client/public/upload/videos');
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API endpoint to create a new post
// routes/postRoutes.js
// ... other imports and routes ...

router.post('/create', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { user, text } = req.body;
  const image = req.files && req.files['image'] ? req.files['image'][0].path : null;
  const video = req.files && req.files['video'] ? req.files['video'][0].path : null;

  try {
    const post = new Post({
      user,
      text,
      image,
      video,
    });

    await post.save();

    // Update the friend feeds with the new post
    const userFriends = await Friend.findOne({ user }).populate('friends');
    if (userFriends && userFriends.friends) {
      for (const friend of userFriends.friends) {
        friend.feed.push(post._id);
        await friend.save();
      }
    }

    res.json({ message: 'Post created successfully!' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/get', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


module.exports = router;
