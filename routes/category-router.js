const express = require("express");

const categoryController = require("../controllers/category-controller");

const router = express.Router();

router.get("/categories", categoryController.categoryListGET);
router.get("/category/create", categoryController.categoryCreateGET);
router.post("/category/create", categoryController.categoryCreatePOST);
router.get("/category/:id", categoryController.categoryDetailGET);

module.exports = router;
