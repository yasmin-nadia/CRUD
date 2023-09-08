const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    
   
    user: { id:{
        type: mongoose.Types.ObjectId,
        ref:"users",
        required:true

    }
        
    },
    mangas:{type:[{
        id:{
            type:mongoose.Types.ObjectId,
            ref:"mangas",
            required:true
        },
        quantity: Number,
       

    },],},
    
   total:{
    type:Number
   },
   checked:{
    type:Boolean,
    default: false
   },
   
},{timestamps:true})
const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;