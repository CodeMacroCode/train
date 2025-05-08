const mongoose = require("mongoose");

const poleAndLatLong = new mongoose.Schema({
  pole: {
    type: String,
    // required: true,
  },
  lat: {
    type: Number,
    // required: true,
  },
  lng: {
    type: Number,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PoleAndLatLong", poleAndLatLong);
