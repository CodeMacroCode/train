const SpeedAndDistance = require("../models/speedAndDistance");
const PoleAndLatLong = require("../models/poleAndLatLong");
const xlsx = require("xlsx");

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

exports.uploadExcelAndSave = async (req, res) => {
  try {
    const file = req.files.find(
      (f) =>
        f.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        f.mimetype === "application/vnd.ms-excel"
    );

    if (!file) {
      return res.status(400).json({ message: "No Excel file found" });
    }

    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const headerRow = data[7]; // Row 8 (index 7)
    const srIndex = headerRow.indexOf("SR IN KMPH");
    const effectiveKmsIndex = headerRow.indexOf("Effective KMs");

    if (srIndex === -1 || effectiveKmsIndex === -1) {
      return res.status(400).json({ message: "Required columns not found" });
    }

    const rawPairs = [];

    for (let i = 8; i < data.length; i++) {
      const row = data[i];
      const srValue = row[srIndex]?.toString().trim();
      const effectiveValue = row[effectiveKmsIndex]?.toString().trim();

      if (!srValue || !effectiveValue) continue;

      const srParts = srValue.split(/\s+/).filter(Boolean);
      const effectiveParts = effectiveValue.split(/\s+/).filter(Boolean);

      const minLength = Math.min(srParts.length, effectiveParts.length);
      for (let j = 0; j < minLength; j++) {
        const sr = srParts[j];
        const effective = effectiveParts[j];

        if (!/^\d{2,3}$/.test(sr) || !/^[\d/]+-[\d/]+$/.test(effective))
          continue;

        rawPairs.push({
          effectiveKms: effective,
          srInKmph: parseInt(sr, 10),
        });
      }
    }

    if (!rawPairs.length) {
      return res.status(400).json({ message: "No valid records found" });
    }

    const enrichedData = await Promise.all(
      rawPairs.map(async (item) => {
        const [pole1Str, pole2Str] = item.effectiveKms.split("-");

        let pole1Data = await PoleAndLatLong.findOne({ pole: pole1Str });
        let pole2Data = await PoleAndLatLong.findOne({ pole: pole2Str });

        if (!pole1Data) {
          pole1Data = await PoleAndLatLong.create({
            pole: pole1Str,
            latitude: 0.0,
            longitude: 0.0,
          });
        }

        if (!pole2Data) {
          pole2Data = await PoleAndLatLong.create({
            pole: pole2Str,
            latitude: 0.0,
            longitude: 0.0,
          });
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
          srInKmph: item.srInKmph,
        };
      })
    );

    const doc = new SpeedAndDistance({
      effectiveKms: enrichedData,
      date: new Date(),
    });

    const saved = await doc.save();
    res.status(201).json({
      message: "Data saved successfully",
      count: enrichedData.length,
      saved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
