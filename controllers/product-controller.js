const asyncHandler = require("express-async-handler");

const ProductModel = require("../models/product-model");

const productList = asyncHandler(async (req, res, next) => {
  const allProducts = await ProductModel.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("product-list-view", {
    title: "All Products",
    products: allProducts,
  });
});

module.exports = {
  productList,
};
