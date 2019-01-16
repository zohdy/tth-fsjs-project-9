const express = require('express');
const router = express.Router();
const Course = require('../models/Course').Course;
const authorize = require('../auth/authorize');

// @route   GET api/courses
// @desc    Get a list of courses
// @access  Public
router.get('/', (req, res, next) => {
    Course.find({})
        .exec((err, courses) => {
           if(err) return next(err);
           res.json(courses);
        });
});

// @route   GET api/courses/id
// @desc    Returns a the course for the provided course ID
// @access  Public
router.get('/:id', (req, res, next) => {
    Course.findById(req.params.id, (err, course) => {
        if(err) return next(err);
        res.json(course);
    });
});

// @route   POST api/courses
// @desc    Creates a new course
// @access  Private
router.post('/', authorize,(req, res, next) => {
    Course.create(req.body, (err) => {
        if(err){
            err.status = 400;
            return next(err);
        }
        res.location('/');
        return res.sendStatus(201);
    });
});

// @route   PUT api/courses/id
// @desc    Updates a course and returns no content
// @access  Private
router.put('/:id', authorize,(req, res, next) => {
    Course.findById(req.params.id, (err, course) => {
        if(err){
            err.status = 400;
            return next(err);
        }
        if (course.user.toString() === req.user._id.toString()) {
            course.updateOne(req.body, (err, result) => {
                if(err) return next(err);
                res.sendStatus(204);
            });
        } else {
            const err = new Error('Course can only be changed by original creator');
            err.status = 403;
            next(err);
        }
    });
});

// @route   DELETE api/courses/id
// @desc    Deletes a course and returns no content
// @access  Private
router.delete('/:id', authorize, (req, res, next) => {
    Course.findById(req.params.id, (err, course) => {
        if(course){
            if (course.user.toString() === req.user._id.toString()) {
                course.remove((err) => {
                    if(err) return next(err);
                    res.sendStatus(204);
                });
            } else {
                const err = new Error('Course can only be removed by original creator');
                err.status = 403;
                next(err)
            }
        } else {
            const err = new Error('Course not valid');
            err.status = 400;
            next(err);
        }
    });
});

module.exports = router;