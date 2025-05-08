const poleAndLatLang = require("../models/poleAndLatLong");

exports.createPoleAndLatLang = async (req, res) => {
  try {
    const { pole, lat, lng } = req.body;

    if (!pole || !lat || !lng) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRecord = new poleAndLatLang({
      pole,
      lat,
      lng,
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
