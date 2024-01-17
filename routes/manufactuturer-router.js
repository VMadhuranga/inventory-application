const express = require("express");

const manufactureController = require("../controllers/manufacturer-controller");

const router = express.Router();

router.get("/manufacturers", manufactureController.manufacturerListGET);

module.exports = router;
