const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create User Schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    emailAddress: {
        type: String,
        required: [true, 'Email address is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

// Hash password before user is saved, using bcrypt
userSchema.pre('save', function(next) {
    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', userSchema);
module.exports.User = User;