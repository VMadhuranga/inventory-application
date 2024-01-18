const express = require("express");

const categoryController = require("../controllers/category-controller");

const router = express.Router();

router.get("/categories", categoryController.categoryListGET);

module.exports = router;
