const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/category-model");
const ProductModel = require("../models/product-model");

const categoryListGET = asyncHandler(async (req, res, next) => {
  const allCategories = await CategoryModel.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("category-list-view", {
    title: "All Categories",
    categories: allCategories,
  });
});

const categoryDetailGET = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    CategoryModel.findById(req.params.id).exec(),
    ProductModel.find({ categories: req.params.id }, "name").exec(),
  ]);

  if (category === null) {
    const error = new Error("Category not found");
    error.status = 404;

    return next(error);
  }

  res.render("category-detail-view", {
    title: category.name,
    category: category,
    categoryProducts: categoryProducts,
  });
});

module.exports = {
  categoryListGET,
  categoryDetailGET,
};
