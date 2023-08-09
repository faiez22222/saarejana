// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Custom validation to ensure at least one of text, image, or video is present
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image && !this.video) {
    const err = new Error('A post must have at least text, image, or video');
    return next(err);
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
