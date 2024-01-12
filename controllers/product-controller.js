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

const productDetail = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id)
    .populate(["manufacturer", "categories", "availableSizes.size"])
    .exec();

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;

    return next(err);
  }

  res.render("product-detail-view", {
    title: product.name,
    product: product,
  });
});

module.exports = {
  productList,
  productDetail,
};
