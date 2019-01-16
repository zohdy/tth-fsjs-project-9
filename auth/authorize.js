const User = require('../models/User').User;
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

// Handles user authorization in request header
module.exports = function authorize(req, res,next) {
    const userAuthorized = auth(req);
    if(userAuthorized){
        User.findOne({emailAddress: userAuthorized.name})
            .exec((err, user) => {
                if(err) return next(err);
                if(!user){
                    err = new Error('Invalid Email');
                    err.status = 401;
                    return next(err);
                }
                bcrypt.compare(userAuthorized.pass, user.password, (err, res) => {
                    if(res){
                        req.user = user;
                        return next();
                    } else {
                        err = new Error('Invalid Password');
                        err.status = 401;
                        return next(err);
                    }
                });
            });
    } else {
        const err = new Error('You need to login to perform this operation');
        err.status = 401;
        next(err);
    }
};