const mongoose = require("mongoose");

const speedAndDistanceSchema = new mongoose.Schema({
  srInKmph: {
    type: [Number],
    // required: true,
  },
  effectiveKms: {
    type: [String],
    // required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SpeedAndDistance", speedAndDistanceSchema);
