const SpeedAndDistance = require("../models/speedAndDistance");
const PoleAndLatLong = require("../models/poleAndLatLong");

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
    const { effectiveKms, srInKmph, vehicleId } = req.body;

    if (!Array.isArray(effectiveKms) || !Array.isArray(srInKmph)) {
      return res.status(400).json({
        message: "effectiveKms and srInKmph must be arrays",
      });
    }

    if (effectiveKms.length !== srInKmph.length) {
      return res.status(400).json({
        message: "effectiveKms and srInKmph arrays must be of the same length",
      });
    }

    // Enrich each entry with pole lat/long info
    const combinedData = await Promise.all(
      effectiveKms.map(async (entry, index) => {
        const [pole1Str, pole2Str] = entry.split("-");

        const pole1Data = await PoleAndLatLong.findOne({ pole: pole1Str });
        const pole2Data = await PoleAndLatLong.findOne({ pole: pole2Str });

        if (!pole1Data || !pole2Data) {
          throw new Error(
            `Lat/Long not found for poles: ${pole1Str}, ${pole2Str}`
          );
        }

        return {
          pole1: {
            pole: pole1Str,
            latitude: pole1Data.latitude,
            longitude: pole1Data.longitude,
          },
          pole2: {
            pole: pole2Str,
            latitude: pole2Data.latitude,
            longitude: pole2Data.longitude,
          },
          srInKmph: srInKmph[index],
        };
      })
    );

    const newRecord = new SpeedAndDistance({
      vehicleId, // optional if not required in schema
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
    const records = await SpeedAndDistance.find(
      {},
      { vehicleId: 0, __v: 0 }
    ).sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get records by pole and lat long
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
