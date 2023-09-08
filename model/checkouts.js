const mongoose = require("mongoose");
const checkoutSchema = new mongoose.Schema({
    cart:{
        type: mongoose.Types.ObjectId,
        ref:"carts",
        required:true
    },
   
    user: {
        type: mongoose.Types.ObjectId,
        ref:"users",
    },
    mangas:{type:[{
        id:{
            type:mongoose.Types.ObjectId,
            ref:"mangas",
        },
        quantity: Number,

    }]},
    
   total:{
    type:Number,
   },
   
},{timestamps:true})
const checkoutModel = mongoose.model("checkouts", checkoutSchema);

module.exports = checkoutModel;