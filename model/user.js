const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  First_name: { type: String, default: null },
  Last_name: { type: String, default: null },
  Email: { type: String, unique: true },
  Mobile_Number: { type: String, unique: true },
  Password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);