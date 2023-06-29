const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, required: true },
  newslatter: { type: Boolean },
  email_offert: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
