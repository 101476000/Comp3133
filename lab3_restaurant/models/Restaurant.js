const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    building: String,
    coord: [Number],
    street: String,
    zipcode: String
}, { _id: false });

const gradeSchema = new mongoose.Schema({
    date: Date,
    grade: String,
    score: Number
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
    address: addressSchema,
    borough: String,
    cuisine: String,
    grades: [gradeSchema],
    name: String,
    restaurant_id: String
}, {
    collection: 'restaurants',
    timestamps: true
});

// indexes for better query performance
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ restaurant_id: 1 });
restaurantSchema.index({ name: 1 });
restaurantSchema.index({ 'address.borough': 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
