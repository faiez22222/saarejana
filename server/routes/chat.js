const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/chatRoom');
const Friend = require('../models/Friend');


// Route to create a new chat room between two friends
router.post('/create', async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    console.log('hey1.5')
    // Check if the friendId exists in the database and is a friend of the authenticated user
    const areFriends = await Friend.exists({
      user: userId,
      friends: friendId,
    });

    if (!areFriends) {
      return res.status(400).json({ message: 'You can only message your friends.' });
    }

    // Check if a chat room already exists between the two friends
    const existingChatRoom = await ChatRoom.findOne({
      members: { $all: [userId, friendId] },
    });

    if (existingChatRoom) {
      return res.status(200).json({ chatRoomId: existingChatRoom._id });
    }

    // Create a new chat room and add both friends as members
    const newChatRoom = new ChatRoom({ members: [userId, friendId] });
    await newChatRoom.save();

    return res.status(201).json({ chatRoomId: newChatRoom._id });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
