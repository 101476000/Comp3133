const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [4, 'Username must be at least 4 characters'],
        maxlength: [100, 'Username must not exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street is required']
        },
        suite: {
            type: String,
            required: [true, 'Suite is required']
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z\s]+$/.test(v);
                },
                message: 'City must contain only alphabets and spaces'
            }
        },
        zipcode: {
            type: String,
            required: [true, 'Zipcode is required'],
            validate: {
                validator: function (v) {
                    return /^\d{5}-\d{4}$/.test(v);
                },
                message: 'Zipcode must be in format DDDDD-DDDD (e.g. 12345-1234)'
            }
        },
        geo: {
            lat: {
                type: String,
                required: [true, 'Latitude is required']
            },
            lng: {
                type: String,
                required: [true, 'Longitude is required']
            }
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        validate: {
            validator: function (v) {
                return /^\d-\d{3}-\d{3}-\d{4}$/.test(v);
            },
            message: 'Phone must be in format D-DDD-DDD-DDDD (e.g. 1-123-123-1234)'
        }
    },
    website: {
        type: String,
        required: [true, 'Website is required'],
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Website must be a valid URL starting with http or https'
        }
    },
    company: {
        name: {
            type: String,
            required: [true, 'Company name is required']
        },
        catchPhrase: {
            type: String,
            required: [true, 'Company catchPhrase is required']
        },
        bs: {
            type: String,
            required: [true, 'Company bs is required']
        }
    }
});

module.exports = mongoose.model('User', UserSchema);
