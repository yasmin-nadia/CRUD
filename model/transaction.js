const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
    buyer:{
        type:mongoose.Types.ObjectId,
        ref:"buyers",
        required:[true,"user id is required"],
    },
    mangas:{
        type:[{id: mongoose.Types.ObjectId,
            quantity:Number,
        }],
        ref:"mangas",
        required:[true,"at least one mangas id is required"],
    },
   


},
{timestamps:true})

const Transactions = mongoose.model("transaction", transactionsSchema);

module.exports = Transactions;