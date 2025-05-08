const SpeedAndDistance = require("../models/speedAndDistance");

// exports.createSpeedAndDistance = async (req, res) => {
//   try {
//     const { srInKmph, effectiveKms } = req.body;

//     if (!srInKmph || !effectiveKms) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newRecord = new SpeedAndDistance({
//       srInKmph,
//       effectiveKms,
//     });

//     const savedRecord = await newRecord.save();
//     res.status(201).json(savedRecord);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createSpeedAndDistance = async (req, res) => {
  try {
    let { effectiveKms, srInKmph, vehicleId } = req.body;

    if (!Array.isArray(effectiveKms) || !Array.isArray(srInKmph)) {
      return res
        .status(400)
        .json({ message: "effectiveKms and srInKmph must be arrays" });
    }

    if (effectiveKms.length !== srInKmph.length) {
      return res.status(400).json({
        message: "effectiveKms and srInKmph arrays must be of the same length",
      });
    }

    const combinedData = effectiveKms.map((entry, index) => {
      const [pole1, pole2] = entry.split("-");
      return {
        pole1,
        pole2,
        srInKmph: srInKmph[index],
      };
    });

    const newRecord = new SpeedAndDistance({
      vehicleId,
      date: new Date(),
      effectiveKms: combinedData,
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await SpeedAndDistance.find().populate("vehicleId");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get records by vehicleId
exports.getRecordByVehicleId = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const record = await SpeedAndDistance.find({ vehicleId }).populate(
      "vehicleId"
    );

    if (!record || record.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this vehicle" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
