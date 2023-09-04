const mongoose = require("mongoose");
const authSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", 
    },

    email: {
     
        type: String,
        unique:true,
        required:[true,"email is required"]

    },

    password: {
        type: String,
        required:[true,"password is required"]

    }
})
const authModel = mongoose.model("authentications", authSchema);

module.exports = authModel;