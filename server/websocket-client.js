// websocket-client.js
const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3001');

socket.on('open', () => {
  console.log('WebSocket connection established.');

  // Send a message to the server
  socket.send('Hello, WebSocket Server!');
});

socket.on('message', (message) => {
  console.log('Message received:', message);
});

socket.on('close', () => {
  console.log('WebSocket connection closed.');
});
