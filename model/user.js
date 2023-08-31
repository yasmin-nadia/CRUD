const mongoose = require("mongoose");

const castsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"name has  to be given"],
        maxlength: 30,
        unique:true
    },
    notable_films: {
        required: [true, "Film name has to be given as array of strings"],
        type: [{
            type: String,
            validate: {
                validator: function(value) {
                   
                    return value.length <= 100; 
                },
                message: "String length must be at most 100 characters long.",
            },
        }],
        validate: {
            validator: function(value) {
        
                return value.length <= 10; 
            },
            message: "Notable films array length has to be less than or equal to 10.",
        },
    },
    awards:{
        type: [{
            award: {
                type: String,
                required: [true, "Award name has to be given"],
            },
            year: {
                type: Number,
                required: [true, "Year of the award has to be given"],
            },
            category:{
                type: String,
                required: [true, "Category name has to be given"],

            },
            movie:{
                type: String,
                required: [true, "Movie name has to be given"],

            },
        }],
        validate: {
            validator: function(value) {
                return value.length <= 5; 
            },
            message: "Awards array cannot have more than 5 elements.",
        },
    },
});

const Cast = mongoose.model("casts", castsSchema);

module.exports = Cast;
