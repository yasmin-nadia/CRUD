const mongoose = require("mongoose");

const directorsSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Director name has to be given"],
        maxlength: 30

    },
    movies: {
        required: [true, "At least one movie has to be given inside an array"],
        type: [{
            type: String,
            maxlength: 30
        }],
        validate: {
            validator: function(arr) {
              return arr.length >= 1 && arr.length <= 10; 
            },
            message: 'Movies array must contain between 1 and 10 elements'
          }

    },
    networth: {
        required: [true, "Net worth has to be given"],
        type: Number,
        min: 0,
        max: 1000000000
    },
    awards:{
        required:[true,"array of awards object must be given"],
        type:[{
            academy:{
                type:Number,
                min:0,
                max:100
            },
            goldenGlobe:{
                type:Number,
                min:0,
                max:100
            },
            bafta:{
                type:Number,
                min:0,
                max:100
            },
            cannes:{
                type:Number,
                min:0,
                max:100
            },
            cbe:{
                type:Number,
                min:0,
                max:100
            },
            nationalBoard:{
                type:Number,
                min:0,
                max:100
            },
            criticsChoice:{
                type:Number,
                min:0,
                max:100
            },



        }],
        validate: {
            validator: function(arr) {
              return arr.length >= 1 && arr.length <= 10; 
            },
            message: 'Awards array must contain between 1 and 10 elements'
          }
    }

})

const Directors = mongoose.model("directors", directorsSchema);

module.exports = Directors;