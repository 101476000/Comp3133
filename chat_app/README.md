# Chat Application - COMP3133 Lab Test 1

Real-time chat application using Socket.io, Express, Mongoose, and Bootstrap.

## Features
- User signup & login with session (localStorage)
- Room-based group chat with predefined rooms
- Private messaging between users
- Typing indicator ("User is typing...")
- Message persistence in MongoDB
- Join/Leave room functionality
- Logout

## Setup

### Prerequisites
- Node.js (v16+)
- MongoDB running locally on port 27017

### Install & Run
```bash
npm install
npm start
```

Server runs at: http://localhost:3000

### Pages
- `/login.html` - Login page
- `/signup.html` - Signup page
- `/chat.html` - Chat interface (requires login)

## MongoDB Collections
- **users** - User accounts
- **groupmessages** - Room chat messages
- **privatemessages** - Private messages between users

## Tech Stack
- **Backend:** Node.js, Express, Socket.io, Mongoose, bcryptjs
- **Frontend:** HTML5, CSS, Bootstrap 5, jQuery, Fetch API
- **Database:** MongoDB
