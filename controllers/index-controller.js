const asyncHandler = require("express-async-handler");

const ProductModel = require("../models/product-model");
const ManufacturerModel = require("../models/manufacturer-model");
const CategoryModel = require("../models/category-model");
const SizeModel = require("../models/size-model");

const recordCount = asyncHandler(async (req, res, next) => {
  const [allProducts, allManufacturers, allCategories, allSizes] =
    await Promise.all([
      ProductModel.find({}).countDocuments().exec(),
      ManufacturerModel.find({}).countDocuments().exec(),
      CategoryModel.find({}).countDocuments().exec(),
      SizeModel.find({}).countDocuments().exec(),
    ]);

  res.render("index", {
    title: "Record Count",
    productsCount: allProducts,
    manufacturersCount: allManufacturers,
    categoriesCount: allCategories,
    sizesCount: allSizes,
  });
});

module.exports = { recordCount };
