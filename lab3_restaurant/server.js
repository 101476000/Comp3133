const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Restaurant Database API',
        version: '1.0.0',
        endpoints: {
            getAllRestaurants: 'GET /restaurants',
            getRestaurantsByCuisine: 'GET /restaurants/cuisine/:cuisineType',
            getRestaurantsSorted: 'GET /restaurants?sortBy=ASC or DESC',
            getDelicatessenNotBrooklyn: 'GET /restaurants/Delicatessen'
        }
    });
});

// Routes
app.use('/restaurants', restaurantRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}`);
});

module.exports = app;
