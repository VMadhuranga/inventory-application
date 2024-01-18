const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

const categoryCreateGET = (req, res, next) => {
  res.render("category-form-view", {
    title: "Create Category",
  });
};

const categoryCreatePOST = [
  body("category-name", "Category name must not be empty")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newCategory = new CategoryModel({
      name: req.body["category-name"],
    });

    if (!errors.isEmpty()) {
      res.render("category-form-view", {
        title: "Create Category",
        category: newCategory,
        errors: errors.array(),
      });

      return;
    }

    await newCategory.save();
    res.redirect(newCategory.url);
  }),
];

module.exports = {
  categoryListGET,
  categoryDetailGET,
  categoryCreateGET,
  categoryCreatePOST,
};
