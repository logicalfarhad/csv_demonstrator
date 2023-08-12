// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  date_of_sign_up: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;