// initializing the model schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the product model schema

const productSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

//package and export model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;