const express = require("express");

const productController = require("../controllers/product-controller");

const router = express.Router();

router.get("/products", productController.productList);
router.get("/product/create", productController.productCreateGET);
router.post("/product/create", productController.productCreatePOST);
router.get("/product/:id/update", productController.productUpdateGET);
router.post("/product/:id/update", productController.productUpdatePOST);
router.get("/product/:id/delete", productController.productDeleteGET);
router.post("/product/:id/delete", productController.productDeletePOST);
router.get("/product/:id", productController.productDetail);

module.exports = router;
