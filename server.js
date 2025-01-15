// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the HTML file when accessed
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    socket.on('join', (username) => {
        socket.username = username
        io.emit('chat message', `${username} connected`);
    });

    socket.on('typing', (username) => {
        io.emit('typing', username)
    })
    
    // Listen for chat messages from the client
    socket.on('chat message', (msg) => {
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        io.emit(`${socket.username} disconnected`);
    });
});

// Start the server on port 3000
server.listen(80, () => {
    console.log('Chat server listening on *:80');
});
