const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const pizzas = require("./pizzas.json");
const Pizza = require("./connection");

const app = express();
app.use(cors());

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(pizzas);

//routes

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend Homepage route" });
});
app.get("/pizzas/getPizzas", (req, res) => {
  // res.json({ message: "Hello from backend" });
  res.json(pizzas);
});

//save to db
app.post("/addNewPizza", async (req, res) => {
  const body = req.body;
  const { name, price, ingredient, image } = req.body;
  console.log(body);

  if (!name || !price || !ingredient)
    res.json({ message: "Enter all the fields value" });

  const newPizza = new Pizza({
    name,
    price: +price,
    ingredient,
    image,
  }); //new Pizza documnet

  const savedPizza = await newPizza.save();

  res
    .status(201)
    .json({ message: "Pizza added successfully", pizza: savedPizza });
});

//read from DB
app.get("/pizzas/userPizza", async (req, res) => {
  const db_pizzas = await Pizza.find({});

  if (!db_pizzas)
    res.status(404).json({ message: "No Custom pizzas available in the DB" });

  res
    .status(200)
    .json({ message: "Custom pizzas sended", db_pizzas: db_pizzas });
});

//run server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend Server is running at Port:", PORT);
});
