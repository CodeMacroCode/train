const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createSpeedAndDistance,
  getAllRecords,
  uploadExcelAndSave,
} = require("../controller/speedAndDistance");
const {
  createPoleAndLatLang,
  getPoleAndLatLang,
} = require("../controller/poleAndLatLang");

const upload = multer({ storage: multer.memoryStorage() }); // Store the file in memory

// for pole and speed
router.post("/add", createSpeedAndDistance);
router.get("/getAll", getAllRecords);
router.post("/uploadExcel", upload.any(), uploadExcelAndSave);
// for pole and lat long
router.post("/pole", createPoleAndLatLang);
router.get("/pole", getPoleAndLatLang);

module.exports = router;
