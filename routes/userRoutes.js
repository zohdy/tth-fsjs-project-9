const express = require('express');
const router = express.Router();
const User = require('../models/User').User;
const authorize = require('../auth/authorize');

// @route   GET api/users/
// @desc    Returns the currently authenticated user
// @access  Private
router.get('/', authorize, (req, res, next) => {
    User.find({})
        .exec(() => res.json(req.user));
});

// @route   GET api/users/
// @desc    Creates a new user
// @access  Public
router.post('/', function(req, res, next) {
    User.create(req.body, (err) => {
        if(err){
            err.status = 400;
            return next(err);
        }
        res.location('/');
        return res.sendStatus(201);
    });
});


module.exports = router;