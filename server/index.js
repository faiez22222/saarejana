// server/server.js
const express = require('express');
const WebSocket = require('ws')
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');


const bodyParser = require('body-parser');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const FriendRequest = require('./models/firendRequest');
const friendRequestRoutes = require('./routes/friendRquestRoutes')
const friend = require('./models/Friend')
const app = express();
const { initializeSocketIO } = require('./socket')

const chatRoutes = require('./routes/chat')
const server = http.createServer(app);
const io = socketio(server)

const chatRoom = require('./models/chatRoom')
const message = require('./models/message')
const feed = require('./routes/feedRoutes')

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/client/public/upload', express.static('client/public/upload'));


// Connect to MongoDB
connectDB();

// API Routes
app.use(cors())
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connect' ,FriendRequest );
app.use('/api/connectroute',friendRequestRoutes )
app.use('api/friend' , friend)
console.log("hey")
app.use('/api/message' ,chatRoutes )
console.log("hey2")
app.use('/api/models' , chatRoom)
app.use('api/post' , feed)



initializeSocketIO(io); // Call the function to set up Socket.IO logic

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});