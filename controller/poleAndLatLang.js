const poleAndLatLang = require("../models/poleAndLatLong");

exports.createPoleAndLatLang = async (req, res) => {
  try {
    const { pole, latitude, longitude } = req.body;

    if (!pole || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRecord = new poleAndLatLang({
      latitude,
      longitude,
      pole,
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPoleAndLatLang = async (req, res) => {
  try {
    const records = await poleAndLatLang.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
