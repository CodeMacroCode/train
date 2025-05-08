const mongoose = require("mongoose");

const speedAndDistance = new mongoose.Schema({
  effectiveKms: [
    {
      pole1: String,
      pole2: String,
      srInKmph: Number,
    },
  ],
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SpeedAndDistance", speedAndDistance);
