const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*', // Укажите фронтенд URL для безопасности
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	console.log('User connected:', socket.id);

	socket.emit('message', 'Welcome to WebSocket server!');

	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id);
	});
});

const PORT = process.env.SERVER_PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server starts on PORT ${PORT}`);
});

module.exports = { app, io };
