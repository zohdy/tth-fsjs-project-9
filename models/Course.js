const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const courseSchema = new Schema({
        user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        title:{
          type: String,
          required: [true, 'Title is required']
        },
        description:{
          type: String,
          required: [true, 'Description is required']
        },
        estimatedTime: String,
        materialsNeeded: String
});

const Course = mongoose.model('Course', courseSchema);
module.exports.Course = Course;