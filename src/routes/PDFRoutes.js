const express = require("express");

const router = express.Router();
const { sign } = require("../controllers/PDFController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/sign", upload.single("file"), sign);

module.exports = router;
