const ChatRoom = require('./models/chatRoom');
const Message = require('./models/message')
// Modular function to handle sending messages
const sendMessage = async (socket, chatRoomId, message) => {
  // ... (same as before)
  try {
    const { userId } = socket;

    // Check if the user is a member of the chat room
    const chatRoom = await ChatRoom.findOne({
      _id: chatRoomId,
      members: userId,
    });
    if (!chatRoom) {
      return socket.emit('chat-error', 'You are not a member of this chat room.');
    }

    // Store the message in the database (create a model for messages)
    const messageData = {
      chatRoom: chatRoomId,
      sender: userId,
      text: message,
    };
    // Assuming you have a model called `Message`, you can use it to store the message
    const newMessage = await Message.create(messageData);

    // Broadcast the message to all members of the chat room
    io.to(chatRoomId).emit('receive-message', { sender: userId, message: newMessage });

  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('chat-error', 'An error occurred while sending the message.');
  }
};

// Modular function to handle joining chat rooms
const joinChatRoom = async (socket, chatRoomId) => {
  // ... (same as before)
  try {
    const { userId } = socket;

    // Check if the user is a member of the chat room
    const chatRoom = await ChatRoom.findOne({
      _id: chatRoomId,
      members: userId,
    });
    if (!chatRoom) {
      return socket.emit('chat-error', 'You are not a member of this chat room.');
    }

    // Join the chat room
    socket.join(chatRoomId);

    // Emit an event to notify the user that they have joined the chat room
    socket.emit('joined-chat-room', { chatRoomId });

    // You can also broadcast a message to other members that a new user has joined the chat room
    // socket.to(chatRoomId).emit('user-joined', { userId });

  } catch (error) {
    console.error('Error joining chat room:', error);
    socket.emit('chat-error', 'An error occurred while joining the chat room.');
  }
};

// Function to initialize Socket.IO logic
const initializeSocketIO = (io) => {
    
  io.on('connection', (socket) => {
    console.log("5")
    console.log('A user connected:', socket.id);

    // Handle sending messages
    socket.on('send-message', ({ chatRoomId, message }) => {
      sendMessage(socket, chatRoomId, message);
    });

    // Handle joining chat rooms
    socket.on('join-chat-room', (chatRoomId) => {
      joinChatRoom(socket, chatRoomId);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

module.exports = {
  initializeSocketIO,
};
