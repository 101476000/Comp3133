const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// API 4: GET all restaurant details (all columns)
// http://localhost:3000/restaurants
router.get('/', async (req, res) => {
    try {
        const { sortBy } = req.query;

        // If sortBy query parameter exists, handle sorting (API 6)
        if (sortBy) {
            const sortOrder = sortBy.toUpperCase() === 'DESC' ? -1 : 1;
            
            const restaurants = await Restaurant.find({})
                .select('_id cuisine name address.borough restaurant_id')
                .sort({ restaurant_id: sortOrder });

            return res.status(200).json({
                success: true,
                count: restaurants.length,
                data: restaurants.map(restaurant => ({
                    id: restaurant._id,
                    cuisines: restaurant.cuisine,
                    name: restaurant.name,
                    city: restaurant.address.borough,
                    restaurant_id: restaurant.restaurant_id
                }))
            });
        }

        // Default: return all restaurants with all columns
        const restaurants = await Restaurant.find({});

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurants',
            error: error.message
        });
    }
});

// API 5: GET all restaurant details by cuisine (all columns)
// http://localhost:3000/restaurants/cuisine/Japanese
// http://localhost:3000/restaurants/cuisine/Bakery
// http://localhost:3000/restaurants/cuisine/Italian
router.get('/cuisine/:cuisineType', async (req, res) => {
    try {
        const { cuisineType } = req.params;

        const restaurants = await Restaurant.find({ 
            cuisine: cuisineType 
        });

        res.status(200).json({
            success: true,
            count: restaurants.length,
            cuisine: cuisineType,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurants by cuisine',
            error: error.message
        });
    }
});

// API 7: GET Delicatessen restaurants not in Brooklyn
// Cuisines = Delicatessen AND City != Brooklyn
// Select: cuisines, name, city (exclude id)
// Sort: Ascending order by name
// http://localhost:3000/restaurants/Delicatessen
router.get('/Delicatessen', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({
            cuisine: 'Delicatessen',
            'address.borough': { $ne: 'Brooklyn' }
        })
        .select('-_id cuisine name address.borough')
        .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants.map(restaurant => ({
                cuisines: restaurant.cuisine,
                name: restaurant.name,
                city: restaurant.address.borough
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching Delicatessen restaurants',
            error: error.message
        });
    }
});

module.exports = router;
