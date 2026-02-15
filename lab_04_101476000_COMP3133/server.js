const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/UserRoutes');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use('/users', userRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
