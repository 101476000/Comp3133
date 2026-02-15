const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = {};
            Object.keys(err.errors).forEach((key) => {
                errors[key] = err.errors[key].message;
            });
            res.status(400).json({ status: false, errors: errors });
        } else if (err.code === 11000) {
            res.status(400).json({ status: false, errors: { email: 'Email already exists' } });
        } else {
            res.status(500).json({ status: false, message: 'Server error' });
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ status: false, message: 'Server error' });
    }
});

module.exports = router;
