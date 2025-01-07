const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

//
const cors = require("cors");
const pizzas = require("./pizzas.json");
const Pizza = require("./connection");
const User = require("./user"); //user schema for authentication
const { setUser, getUser } = require("./services/auth");
const SECRET_KEY = "Shubham@123@";

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend's origin
    credentials: true, // Allow sending and receiving cookies
  })
);

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
// app.get("/pizzas/userPizza", authenticationToken, async (req, res) => {
//   const db_pizzas = await Pizza.find({});

//   if (!db_pizzas)
//     res.status(404).json({ message: "No Custom pizzas available in the DB" });

//   res
//     .status(200)
//     .json({ message: "Custom pizzas sended", db_pizzas: db_pizzas });
// });

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

  res.status(200).json({
    message: "Pizza updated successfully",
    Updated_pizza: updatedPizza,
  });
});

//for authentication -> register route

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(name, email, password);

  if (!name || !email || !password) {
    //user form data validation
    return res.status(400).json({ message: "All fields are required." });
  }

  const createdUser = await User.create({
    //create user
    name,
    email,
    password,
  });

  if (!createdUser) {
    console.error("Failed to create the user in the DB");
    res.status(400).json({ message: "Failed to create the user in the DB" });
  }

  res.status(200).json({ message: "Successfully created the  user in the DB" });
});

//user login route ->user enter email,pswd and the route looks for the user in the Db
// 1- using statefull auth
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   console.log(email, password);

//   if (!email || !password)
//     return res
//       .status(400)
//       .json({ message: "All fields are required for LoggingIn." });

//   const loggedUser = await User.findOne({ email, password });

//   if (!loggedUser) {
//     console.error("Failed to fetch the user from the DB");
//     res.status(400).json({ message: "User does nt exsist in the DB" });
//   }

//   console.log(loggedUser);

//   //create a session Id using uuid package
//   const sessionId = uuidv4();
//   console.log(sessionId);
//   setUser(sessionId, loggedUser); //map user and session id
//   res.cookie("uid", sessionId); //create a cookie for storing it to the server

//   res
//     .status(200)
//     .json({ message: "User Successfully LoggedIn ", loggedUser: loggedUser });

//   // res.redirect("/userPizza");
// });

// 2- using jwt auth
//read custom piiza from DB (delete this since it is also above, this one is for practice only)
app.get("/pizzas/userPizza", authenticationToken, async (req, res) => {
  const db_pizzas = await Pizza.find({});

  if (!db_pizzas)
    res.status(404).json({ message: "No Custom pizzas available in the DB" });

  res
    .status(200)
    .json({ message: "Custom pizzas sended", db_pizzas: db_pizzas });
});

//till here delete this

//middleware for authenticating the jwt token
function authenticationToken(req, res, next) {
  const { authorization: authHeader } = req.headers; //get the jwt token from frontend. It is format: "Bearer YOUR_JWT_TOKEN"
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  console.log("This is the authHeader-> \n", authHeader);

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  console.log("This is the token->", token);

  //verify the jwt token using  the secret key:
  jwt.verify(token, SECRET_KEY, (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    //if auth sucessfull, attach data to the request
    req.user = data;
    console.log("\n This is the decoded data -> ", data);

    next();
  });
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "All fields are required for LoggingIn." });

  const loggedUser = await User.findOne({ email, password });

  if (!loggedUser) {
    console.error("Failed to fetch the user from the DB");
    res.status(400).json({ message: "User does nt exsist in the DB" });
  }

  console.log(loggedUser);

  const userObj = {
    name: loggedUser.name,
    email: loggedUser.email,
    password: loggedUser.password,
  };

  //jwt in action
  const access_token = jwt.sign(userObj, SECRET_KEY);

  res.json({
    message: " the access token received",
    access_token: access_token,
  });
});

//run server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend Server is running at Port:", PORT);
});

//EV933617121IN DEGREE NO
