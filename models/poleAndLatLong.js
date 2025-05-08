const mongoose = require("mongoose");

const poleAndLatLong = new mongoose.Schema({
  latitude: {
    type: Number,
    // required: true,
  },
  longitude: {
    type: Number,
    // required: true,
  },
  pole: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("PoleAndLatLong", poleAndLatLong);
