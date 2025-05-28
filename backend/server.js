const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (req, res) => res.send('Hello from backend!'));
app.use('/api/users', require('./routes/userRoutes'));

let onlineUsers = {}; // socket.id -> username

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (username) => {
        onlineUsers[socket.id] = username;
        console.log(`${username} joined`);
        io.emit('update_users', Object.values(onlineUsers));
    });

    socket.on('send_message', (data) => {
        io.emit('receive_message', { username: onlineUsers[socket.id], text: data.text });
    });

    socket.on('disconnect', () => {
        const username = onlineUsers[socket.id];
        console.log(`${username} disconnected`);
        delete onlineUsers[socket.id];
        io.emit('update_users', Object.values(onlineUsers));
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
