const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'view')));

// API routes
app.use('/api/users', userRoutes);

// Serve pages
app.get('/', (req, res) => res.redirect('/login.html'));

// MongoDB connect
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User tracking
const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register user
  socket.on('registerUser', ({ username }) => {
    users[socket.id] = users[socket.id] || {};
    users[socket.id].username = username;
  });

  // Join room
  socket.on('joinRoom', async ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { ...(users[socket.id] || {}), username, room };

    // Bot welcome
    socket.emit('message', {
      from_user: 'Chat App Bot',
      message: `Welcome to ${room}!`,
      date_sent: formatDate()
    });

    // Bot notify others
    socket.to(room).emit('message', {
      from_user: 'Chat App Bot',
      message: `${username} has joined the chat`,
      date_sent: formatDate()
    });

    // Room users list
    io.to(room).emit('roomUsers', getRoomUsers(room));

    // Room history
    try {
      const history = await GroupMessage.find({ room }).sort({ _id: -1 }).limit(50);
      socket.emit('messageHistory', history.reverse());
    } catch (err) {
      console.error('Error loading history:', err);
    }
  });

  // Group message
  socket.on('chatMessage', async ({ username, room, message }) => {
    const msgData = {
      from_user: username,
      room,
      message,
      date_sent: formatDate()
    };

    // Save group message
    try {
      await new GroupMessage(msgData).save();
    } catch (err) {
      console.error('Error saving message:', err);
    }

    // Broadcast room message
    io.to(room).emit('message', msgData);
  });

  // Private message
  socket.on('privateMessage', async ({ from_user, to_user, message }) => {
    const msgData = {
      from_user,
      to_user,
      message,
      date_sent: formatDate()
    };

    // Save private message
    try {
      await new PrivateMessage(msgData).save();
    } catch (err) {
      console.error('Error saving private message:', err);
    }

    // Find recipient socket
    const targetSocket = Object.keys(users).find(
      (id) => users[id].username === to_user
    );

    // Send to recipient
    if (targetSocket) {
      io.to(targetSocket).emit('privateMessage', msgData);
    }

    // Send back to sender
    socket.emit('privateMessage', msgData);
  });

  // Private typing indicator
  socket.on('typingPrivate', ({ from_user, to_user }) => {
    const targetSocket = Object.keys(users).find(
      (id) => users[id].username === to_user
    );
    if (targetSocket) {
      io.to(targetSocket).emit('typingPrivate', { from_user });
    }
  });

  // Private stop typing
  socket.on('stopTypingPrivate', ({ to_user }) => {
    const targetSocket = Object.keys(users).find(
      (id) => users[id].username === to_user
    );
    if (targetSocket) {
      io.to(targetSocket).emit('stopTypingPrivate');
    }
  });

  // Room typing indicator
  socket.on('typing', ({ username, room }) => {
    socket.to(room).emit('typing', { username });
  });

  // Room stop typing
  socket.on('stopTyping', ({ room }) => {
    socket.to(room).emit('stopTyping');
  });

  // Leave room
  socket.on('leaveRoom', () => {
    const user = users[socket.id];
    if (!user || !user.room) return;

    socket.leave(user.room);

    socket.to(user.room).emit('message', {
      from_user: 'Chat App Bot',
      message: `${user.username} has left the chat`,
      date_sent: formatDate()
    });

    io.to(user.room).emit('roomUsers', getRoomUsers(user.room));

    // Keep username, clear room
    users[socket.id] = { username: user.username };
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user && user.room) {
      socket.to(user.room).emit('message', {
        from_user: 'Bot',
        message: `${user.username} has left the chat`,
        date_sent: formatDate()
      });

      io.to(user.room).emit('roomUsers', getRoomUsers(user.room));
    }
    delete users[socket.id];
  });
});

// Room users helper
function getRoomUsers(room) {
  return Object.values(users).filter(u => u.room === room);
}

// Date helper
function formatDate() {
  return new Date().toLocaleString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

