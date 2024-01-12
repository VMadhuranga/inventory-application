const express = require("express");

const productController = require("../controllers/product-controller");

const router = express.Router();

router.get("/products", productController.productList);
router.get("/product/:id", productController.productDetail);

module.exports = router;
