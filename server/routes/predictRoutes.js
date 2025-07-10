const express = require("express");
const router = express.Router();
const multer = require("multer");
const { predictdisease, getPredictById, getAllHistory } = require("../controllers/predictController");
const authenticateToken = require("../middleware/auth");

const upload = multer({ dest: "uploads/" });
router.post("/predict", authenticateToken, upload.single('file'), predictdisease);

router.get("/predict/:id", getPredictById);
router.get("/history", authenticateToken, getAllHistory);
module.exports = router;
