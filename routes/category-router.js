const express = require("express");

const categoryController = require("../controllers/category-controller");

const router = express.Router();

router.get("/categories", categoryController.categoryListGET);
router.get("/category/create", categoryController.categoryCreateGET);
router.post("/category/create", categoryController.categoryCreatePOST);
router.get("/category/:id/update", categoryController.categoryUpdateGET);
router.post("/category/:id/update", categoryController.categoryUpdatePOST);
router.get("/category/:id/delete", categoryController.categoryDeleteGet);
router.post("/category/:id/delete", categoryController.categoryDeletePOST);
router.get("/category/:id", categoryController.categoryDetailGET);

module.exports = router;
