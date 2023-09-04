const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    
   
    email:{
      
        type:String,
        unique:true,
        required:[true,'email must be given']
    },
    name:{
        type:String,
        required:[true,'name must be given']
    },
    phone:{
        type:String,
        required:[true,'email must be given']
    },
    address:{
        type:String,
        required:[true,'address must be given']
    }
})
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;