const asyncHandler = require("express-async-handler");

const SizeModel = require("../models/size-model");
const ProductModel = require("../models/product-model");

const prodSizeListGET = asyncHandler(async (req, res, next) => {
  const allSizes = await SizeModel.find({}).sort({ type: 1 }).exec();

  res.render("size-list-view", {
    title: "All Sizes",
    sizes: allSizes,
  });
});

const prodSizeDetailGET = asyncHandler(async (req, res, next) => {
  const [size, sizeProducts] = await Promise.all([
    SizeModel.findById(req.params.id).exec(),
    ProductModel.find({ "availableSizes.size": req.params.id }).exec(),
  ]);

  if (size === null) {
    const error = new Error("Size not found");
    error.status = 404;

    return next(error);
  }

  res.render("size-detail-view", {
    title: size.type,
    size: size,
    sizeProducts: sizeProducts,
  });
});

module.exports = {
  prodSizeListGET,
  prodSizeDetailGET,
};
