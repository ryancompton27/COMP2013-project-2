//initializing server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose"); // import mongoose
require("dotenv").config(); // import dotenv
const { DB_URI } = process.env; // to grab the same variable from the dotenv file
const cors = require("cors"); // for disabling default browser security

const Product = require("./models/product"); // importing the model schema

//middleware
server.use(express.json()); // to ensure data is transmitted as json
server.use(express.urlencoded({ extended: true })); // to ensure that data is encoded and decoded while transmission
server.use(cors());

//database connection and server listening
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Database is connected\n Server is listening on ${port}`);
    });
  })
  .catch((error) => console.log(error.message));

//Routes
//Root Route
server.get("/", (request, response) => {
  response.send("server is live!");
});

//to get all the data from products db
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

//to POST a new product to db
server.post("/products", async (request, response) => {
  const { id, productName, brand, image, price } = request.body;
  const newProduct = new Product({
    id,
    productName,
    brand,
    image,
    price,
  });
  try {
    await newProduct.save();
    response.status(200).send({ message: `Product is added successfully with the id: ${id}` });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

//to delete a product from db by its id
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Product.findOneAndDelete({id: id});
    response.send({message: `Product is deleted with the id: ${id}`});
  } catch (error) {
    response.status(400).send({message: error.message});
  }
})

// to get one product by id
server.get("/products/:id", async (request, response) => {
  const {id} = request.params;
  try{
    const productToEdit = await Product.findOne({id: id});
    response.send(productToEdit)
  } catch(error) {
    response.status(500).send({message: error.message});
  }
})

// to patch a contact by id
server.patch("/products/:id", async (request, response) => {
  const {id} = request.params;
  const {productName, brand, image, price} = request.body;
  try {
    await Product.findOneAndUpdate({id: id}, {
      productName,
      brand,
      image,
      price,
    });
    response.send({message: `Product is updated with id: ${id}`})
  } catch (error) {
    response.status(500).send({message: error.message});
  }
})