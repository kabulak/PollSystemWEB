const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// In-memory poll storage
const polls = {};

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to create a poll
app.post('/createPoll', (req, res) => {
    const { question, choices } = req.body;

    if (!question || !choices || choices.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide a question and choices.' });
    }

    const pollId = Date.now(); // Unique poll ID based on current timestamp
    polls[pollId] = {
        question,
        choices: choices.map(option => ({ option, votes: 0 })),
        totalVotes: 0,
    };

    io.emit('polls', polls); // Broadcast the updated polls to all connected clients
    res.status(201).json({ message: 'Poll created successfully', pollId });
});

// Route to delete a poll
app.delete('/deletePoll/:pollId', (req, res) => {
    const { pollId } = req.params;

    if (!polls[pollId]) {
        return res.status(404).json({ error: 'Poll not found.' });
    }

    // Delete the poll from the in-memory storage
    delete polls[pollId];

    io.emit('polls', polls); // Broadcast the updated polls to all clients
    res.status(200).json({ message: 'Poll deleted successfully' });
});

// WebSocket connection to handle live updates
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('polls', polls); // Send the current polls when a user connects

    // Handle voting
    socket.on('vote', (pollId, choiceIndex) => {
        if (polls[pollId] && polls[pollId].choices[choiceIndex]) {
            polls[pollId].choices[choiceIndex].votes++; // Increment votes for selected choice
            polls[pollId].totalVotes++; // Increment total votes for the poll
            io.emit('polls', polls); // Broadcast updated polls to all clients
        }
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Serve the index page (for creating polls)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the results page
app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
