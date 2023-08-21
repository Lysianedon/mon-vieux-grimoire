const mongoose = require('mongoose');
// const uniqueValidator = require("mongoose-unique-validator");

const bookSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title : {
        type: String,
        required: true,
    },
    author : {
        type: String,
        required: true,
    },
    imageUrl :{
        type: String,
        required: true,
    },
    year: {
        type: Number, 
        required: true
    },
    genre: {
        type: String,
        required: true,
    },
    ratings:[ {
        userId: { type: String, required: true, },
       grade: {type: Number, required: true,  min: 1, max: 5 },
       _id: false,
    },
    ],
    averageRating: {
        type: Number,
        required: true,
    }
})
// bookSchema.plugin(uniqueValidator);
const Books = mongoose.model('Books', bookSchema);
module.exports = Books; 