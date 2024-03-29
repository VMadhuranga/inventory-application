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

const categoryUpdateGET = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id).exec();

  if (category === null) {
    const error = new Error("Category not found");
    error.status = 404;

    return next(error);
  }

  res.render("category-form-view", {
    title: "Update Category",
    category: category,
  });
});

const categoryUpdatePOST = [
  body("category-name", "Category name must not be empty")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new CategoryModel({
      name: req.body["category-name"],
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category-form-view", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });

      return;
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      category,
      {},
    );
    res.redirect(updatedCategory.url);
  }),
];

const categoryDeleteGet = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    CategoryModel.findById(req.params.id).exec(),
    ProductModel.find({ categories: req.params.id }, "name").exec(),
  ]);

  if (category === null) {
    res.redirect("/categories");
  }

  res.render("category-delete-view", {
    title: "Delete Category",
    category: category,
    categoryProducts: categoryProducts,
  });
});

const categoryDeletePOST = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    CategoryModel.findById(req.params.id).exec(),
    ProductModel.find({ categories: req.params.id }, "name").exec(),
  ]);

  if (categoryProducts.length) {
    res.render("category-delete-view", {
      title: "Delete Category",
      category: category,
      categoryProducts: categoryProducts,
    });

    return;
  }

  await CategoryModel.findByIdAndDelete(req.params.id);
  res.redirect("/categories");
});

module.exports = {
  categoryListGET,
  categoryDetailGET,
  categoryCreateGET,
  categoryCreatePOST,
  categoryUpdateGET,
  categoryUpdatePOST,
  categoryDeleteGet,
  categoryDeletePOST,
};
