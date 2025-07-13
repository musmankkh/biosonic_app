const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { Predicter } = require("../models/Prediction");

// List of valid chest locations matching FastAPI enum
const validChestLocations = [
  "Anterior Left (A L)",
  "Anterior Left Upper (A L U)",
  "Anterior Right (A R)",
  "Anterior Right Lower (A R L)",
  "Anterior Right Middle (A R M)",
  "Anterior Right Upper (A R U)",
  "Anterior Upper Right (A U R)",
  "Lateral Left (L L)",
  "Lateral Right (L R)",
  "Posterior (P)",
  "Posterior Left (P L)",
  "Posterior Left Lower & Right (P L L & P R)",
  "Posterior Left Lower (P L L)",
  "Posterior Left Middle (P L M)",
  "Posterior Left Right (P L & P R)",
  "Posterior Left Upper (P L U)",
  "Posterior Right (P R)",
  "Posterior Right Lower (P R L)",
  "Posterior Right Middle (P R M)",
  "Posterior Right Upper (P R U)",
  "Trachea (Tc)",
];

// Helper to get top prediction
function getTopPrediction(predictions = []) {
  if (!Array.isArray(predictions) || predictions.length === 0)
    return { label: "N/A", confidence: "0.0" };

  const top = predictions[0]; // Since array is already sorted
  return {
    label: top.label || "N/A",
    confidence: top.confidence?.toFixed(1) || "0.0",
  };
}


// POST /predict
const predictdisease = async (req, res) => {
  try {
    const { name, age, gender, chest_location } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Validate chest location
    if (!validChestLocations.includes(chest_location)) {
      return res.status(400).json({
        error: "Invalid chest location. Must match predefined enum values.",
        validOptions: validChestLocations,
      });
    }

    // Build form data
    const form = new FormData();
    form.append("file", fs.createReadStream(file.path));
    form.append("age", parseFloat(age));
    form.append("gender", gender);
    form.append("chest_location", chest_location); // exact match to enum

    const response = await axios.post("http://127.0.0.1:8000/predict", form, {
      headers: form.getHeaders(),
    });

    const predictions = response.data["predictions"] || [];


    // Save to MongoDB
    const patient = new Predicter({
      user: req.user.id,
      name,
      age: parseFloat(age),
      gender,
      chest_location,
      filename: file.filename,
      predictions,
    });

    await patient.save();

    res.json({ message: "Analysis complete", predictions });
  } catch (err) {
    console.error("Prediction error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /predict/:id
const getPredictById = async (req, res) => {
  try {
    const data = await Predicter.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Prediction not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /predict/history
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
