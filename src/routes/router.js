const express = require("express");
const router = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

router.use("/api/swagger", swaggerUi.serve);
router.get("/api/swagger", swaggerUi.setup(swaggerDocument));

router.use("/api/pdf", require("./PDFRoutes"));

module.exports = router;
