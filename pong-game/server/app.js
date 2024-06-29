const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('../public'));

// Store connected players
let players = [];

// WebSocket event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new player joining
  socket.on('joinGame', (username) => {
    console.log(`${username} joined the game`);
    players.push({ id: socket.id, username });
    socket.emit('playerList', players);
    socket.broadcast.emit('newPlayer', { id: socket.id, username });
  });

  // Handle player movement
  socket.on('move', (data) => {
    socket.broadcast.emit('playerMoved', { id: socket.id, direction: data.direction });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
    players = players.filter(player => player.id !== socket.id);
    io.emit('playerDisconnected', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
