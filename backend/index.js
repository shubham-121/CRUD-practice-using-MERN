const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

//
const cors = require("cors");
const pizzas = require("./pizzas.json");
const Pizza = require("./connection");
const User = require("./user"); //user schema for authentication
const { setUser, getUser } = require("./services/auth");
const UserSession = require("./session");

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
app.use(cookieParser());

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

// //read custom piiza from DB
// app.get("/pizzas/userPizza", async (req, res) => {
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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  //1- validate the input fields
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "All fields are required for LoggingIn." });

  //2-authenticate the user
  const loggedUser = await User.findOne({ email, password });

  if (!loggedUser) {
    console.error("Failed to fetch the user from the DB");
    res.status(400).json({ message: "User does nt exsist in the DB" });
  }

  console.log(loggedUser);

  //3- create Session for the user ( session id and expiry token)
  const sessionToken = Math.random().toString(36).substring(2);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const newSession = new UserSession({
    userId: loggedUser._id,
    sessionToken: sessionToken,
    expiresAt: expiresAt,
  });

  //4- save the session in the DB
  const isCreatedSession = await newSession.save();
  console.log("USer session created successfully", isCreatedSession);

  if (!isCreatedSession)
    res.status(400).json({ message: "Cannot create the session for the user" });

  //5- set the cookie to local storage
  res.cookie("sessionToken", sessionToken, {
    httpOnly: true, // Prevents client-side access to the cookie
    expires: expiresAt, // Set cookie expiry time
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevents CSRF attacks
  });

  //6- send the response to the user
  res.status(200).json({
    message: "USer session created successfully",
    sessionCreated: isCreatedSession,
    loggedUser: loggedUser,
  });
});

//read custom piiza from DB (only for authenticated user only)
app.get("/pizzas/userPizza", authenticateSession, async (req, res) => {
  // console.log("After auth check", req);

  try {
    const db_pizzas = await Pizza.find({});

    if (!db_pizzas)
      res.status(404).json({ message: "No Custom pizzas available in the DB" });

    res
      .status(200)
      .json({ message: "Custom pizzas sended", db_pizzas: db_pizzas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//authenticate the current user session
async function authenticateSession(req, res, next) {
  const sessionToken = req.cookies.sessionToken;
  console.log("Session token is:", sessionToken);

  if (!sessionToken)
    res
      .status(400)
      .json({ message: "No active session token found, login again" });

  //find the active user session in the DB by session token
  try {
    const user_session = await UserSession.findOne({ sessionToken });

    if (!user_session) {
      return res.status(401).json({ message: "Invalid session token" });
    }

    //Session expire check
    if (Date.now() > user_session.expiresAt) {
      // delete the expired session from the DB here
      await UserSession.deleteOne({ sessionToken });

      return res.status(401).json({ message: "Session expired" });
    }

    req.user = user_session;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
} //authenticate the session middleware

//logout the user
app.post("/logout", authenticateSession, async (req, res) => {
  const sessionToken = req.cookies.sessionToken;

  console.log("This is the logout token", sessionToken);
  //delete session from browser
  res.clearCookie("sessionToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict",
  });

  console.log("cookie cleareed from browser");

  // delete session from DB
  const deletedSession = await UserSession.deleteOne({ sessionToken });
  console.log(deletedSession);

  res.status(200).json({ message: "Session logged out and cookie cleared" });
});

//run server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend Server is running at Port:", PORT);
});

//for setting the cookie
//  res.cookie("sessionToken", sessionToken, {
//    httpOnly: true,
//    secure: process.env.NODE_ENV === "production", // Set to true in production
//    sameSite: "Strict", // Prevent CSRF attacks
//    expires: expiresAt, // Cookie expiration time
//  });
