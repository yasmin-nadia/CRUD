const mongoose = require("mongoose");

const mangasSchema = new mongoose.Schema({
    id: {
        unique:true,
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
})

const Manga = mongoose.model("mangas", mangasSchema);

module.exports = Manga;