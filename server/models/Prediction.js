// models/Prediction.js
const mongoose = require("mongoose");

const Prediction = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  age: Number,
  gender: String,
  chestLocation: String,
  filename: String,
  predictions: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Predicter = mongoose.model("Prediction", Prediction);

module.exports = {
  Predicter,
};
