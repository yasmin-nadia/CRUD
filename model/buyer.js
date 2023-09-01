const mongoose = require("mongoose");

const buyersSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      }

})
const Buyer = mongoose.model("buyers", buyersSchema);

module.exports = Buyer;