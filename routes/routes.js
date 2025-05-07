const express = require("express");
const router = express.Router();
const {
  createSpeedAndDistance,
  getAllRecords,
  getRecordByVehicleId,
} = require("../controller/speedAndDistanceSchema");

router.post("/add", createSpeedAndDistance);

router.get("/gelAll", getAllRecords);

router.get("/vehicle/:vehicleId", getRecordByVehicleId);

module.exports = router;
