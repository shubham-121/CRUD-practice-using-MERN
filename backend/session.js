//session schema

const mongoose = require("mongoose");

// mongoose
//   .connect(" mongodb://127.0.0.1:27017/UserSession")
//   .then(() => console.log("Connected to the session DB"))
//   .catch((err) => console.error("Cannot connect to the session Db", err));

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User schema
      required: true,
    },
    sessionToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const UserSession = mongoose.model("UserSession", sessionSchema);

module.exports = UserSession;
