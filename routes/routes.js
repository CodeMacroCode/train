const express = require("express");
const router = express.Router();
const {
  createSpeedAndDistance,
  getAllRecords,
  getRecordByVehicleId,
} = require("../controller/speedAndDistance");
const {
  createPoleAndLatLang,
  getPoleAndLatLang,
} = require("../controller/poleAndLatLang");

// for pole and speed
router.post("/add", createSpeedAndDistance);
router.get("/getAll", getAllRecords);
router.get("/vehicle/:vehicleId", getRecordByVehicleId);

// for pole and lat long
router.post("/pole", createPoleAndLatLang);
router.get("/pole", getPoleAndLatLang);
module.exports = router;
