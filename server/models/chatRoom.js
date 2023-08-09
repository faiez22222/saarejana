const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: { type: String }, // Optional name for the chat room
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs in the chat room
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
