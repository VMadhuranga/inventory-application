const express = require("express");

const productController = require("../controllers/product-controller");

const router = express.Router();

router.get("/products", productController.productList);
router.get("/product/create", productController.productCreateGET);
router.post("/product/create", productController.productCreatePOST);
router.get("/product/:id", productController.productDetail);

module.exports = router;
