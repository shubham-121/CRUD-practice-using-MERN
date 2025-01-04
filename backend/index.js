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

//read custom piiza from DB
app.get("/pizzas/userPizza", async (req, res) => {
  const db_pizzas = await Pizza.find({});

  if (!db_pizzas)
    res.status(404).json({ message: "No Custom pizzas available in the DB" });

  res
    .status(200)
    .json({ message: "Custom pizzas sended", db_pizzas: db_pizzas });
});

//delet custom pizza from db

app.delete("/pizzas/deletePizza/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Deleting pizza with the id:", id);

  if (!id) {
    alert("Erro missing  pizza id");
    res.status(400).json({ message: "Error missing piiza id" });
  }

  const deletedPizza = await Pizza.findByIdAndDelete(id);
  if (!deletedPizza) {
    console.log("Pizzaa not found in the database");
    res.status(400).json({ message: "Pizzaa not found in the database" });
  }

  console.log("Successfully deleted the pizza: ", deletedPizza);

  res
    .status(200)
    .json({ message: "Successfully deleted the pizza ", pizza: deletedPizza });
});

//read data with id for editing a pizza
app.get("/editPizza/:id", async (req, res) => {
  const pizzaId = req.params.id;
  console.log(pizzaId);

  const selectedPizza = await Pizza.findById(pizzaId);
  console.log(selectedPizza);

  if (!selectedPizza) {
    console.log("Pizzaa not found in the database");
    res.status(400).json({ message: "Pizzaa not found in the database" });
  }

  res
    .status(200)
    .json({ message: "Pizza with the id found ", pizza: selectedPizza });
});

//route for updating the pizza with the current id from above
app.put("/editPizza/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedPizza = await Pizza.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!updatedPizza) {
    console.log("Cannot update the pizza in DB");
    res.status(400).json({ message: "Pizzaa update in the Db failed " });
  }

  res
    .status(200)
    .json({
      message: "Pizza updated successfully",
      Updated_pizza: updatedPizza,
    });
});

//run server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend Server is running at Port:", PORT);
});
