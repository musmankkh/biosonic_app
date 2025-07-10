const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./utils/db");
const userRoutes = require("./routes/userRoutes");
const predictRoutes = require("./routes/predictRoutes");
const cors = require("cors");
const fileUpload = require("express-fileupload"); // Add for file handling

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data parsing


app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:7860/predict", "http://127.0.0.1:7860"], // Allow both variants
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);



// Routes
app.use("/api/users", userRoutes);
app.use("/api", predictRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));