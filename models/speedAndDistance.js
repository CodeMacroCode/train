const mongoose = require("mongoose");

const poleSchema = new mongoose.Schema({
  pole: String,
  latitude: Number,
  longitude: Number,
  srInKmph: Number,
});

const speedAndDistanceSchema = new mongoose.Schema({
  effectiveKms: [
    {
      pole1: poleSchema,
      pole2: poleSchema,
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

module.exports = mongoose.model("SpeedAndDistance", speedAndDistanceSchema);
