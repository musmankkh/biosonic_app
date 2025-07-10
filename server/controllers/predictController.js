const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { Predicter } = require("../models/Prediction");

function getTopPrediction(predictionObj) {
  if (!predictionObj) return { label: "N/A", confidence: "0.0" };

  const entries = Object.entries(predictionObj).map(([key, val]) => {
    // Strip '%' and parse to float
    const confidence = parseFloat(val.replace("%", "")) || 0;
    return [key, confidence];
  });

  entries.sort((a, b) => b[1] - a[1]);
  return {
    label: entries[0]?.[0] || "N/A",
    confidence: entries[0]?.[1].toFixed(1) || "0.0",
  };
}

const predictdisease = async (req, res) => {
  try {
    const { name, age, gender, chestLocation } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const form = new FormData();
    form.append("audio", fs.createReadStream(file.path));

    const response = await axios.post("http://127.0.0.1:7860/predict", form, {
      headers: form.getHeaders(),
    });

    const predictions = response.data["Top-3 Predictions"] || {};

    // Save to MongoDB
    const patient = new Predicter({
      user: req.user.id,
      name,
      age,
      gender,
      chestLocation,
      filename: file.filename,
      predictions,
    });

    await patient.save();

    res.json({ message: "Analysis complete", predictions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPredictById = async (req, res) => {
  try {
    const data = await Predicter.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Prediction not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllHistory = async (req, res) => {
  try {
    const results = await Predicter.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    const response = results.map((item) => {
      const { label, confidence } = getTopPrediction(item.predictions);

      return {
        id: item._id,
        name: item.name,
        age: item.age,
        date: new Date(item.createdAt).toLocaleDateString("en-GB"),
        time: new Date(item.createdAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        topPrediction: label.charAt(0).toUpperCase() + label.slice(1),
        confidence,
      };
    });

    res.json(response);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
};

module.exports = {
  predictdisease,
  getPredictById,
  getAllHistory,
};
