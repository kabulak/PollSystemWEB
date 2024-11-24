const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('message', (data) => {
        console.log('Message from client: ' + data);
        socket.emit('message', 'Hello, Client!');
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
