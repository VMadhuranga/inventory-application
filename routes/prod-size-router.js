const express = require("express");

const prodSizeController = require("../controllers/prod-size-controller");

const router = express.Router();

router.get("/sizes", prodSizeController.prodSizeListGET);

module.exports = router;
