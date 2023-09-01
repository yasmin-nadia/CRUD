const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
    buyer: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "buyers", 
            }
        },
    ],
    
    mangas: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "mangas",
            },
            quantity: Number,
        },
    ],
    
   


},
{timestamps:true})

const Transactions = mongoose.model("transactions", transactionsSchema);

module.exports = Transactions;