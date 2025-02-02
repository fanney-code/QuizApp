const mongoose = require("mongoose");

// User schema definition
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures the username is unique in the database
  },
  password: {
    type: String,
    required: true, // The password must be provided
  },
});

// Creating the User model based on the schema
module.exports = mongoose.model("User", UserSchema);
