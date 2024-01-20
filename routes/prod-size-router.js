const express = require("express");

const prodSizeController = require("../controllers/prod-size-controller");

const router = express.Router();

router.get("/sizes", prodSizeController.prodSizeListGET);
router.get("/size/create", prodSizeController.prodSizeCreateGET);
router.post("/size/create", prodSizeController.prodSizeCreatePOST);
router.get("/size/:id/update", prodSizeController.prodSizeUpdateGET);
router.post("/size/:id/update", prodSizeController.prodSizeUpdatePOST);
router.get("/size/:id/delete", prodSizeController.prodSizeDeleteGET);
router.post("/size/:id/delete", prodSizeController.prodSizeDeletePOST);
router.get("/size/:id", prodSizeController.prodSizeDetailGET);

module.exports = router;
