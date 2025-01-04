const mongoose = require("mongoose");

//connection string
mongoose
  .connect("mongodb://127.0.0.1:27017/pizza_database")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo Error connecting to DB", err));

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ingredient: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Pizza = mongoose.model("pizza", pizzaSchema);

module.exports = Pizza;
