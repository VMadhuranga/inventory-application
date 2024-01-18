const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/category-model");

const categoryListGET = asyncHandler(async (req, res, next) => {
  const allCategories = await CategoryModel.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("category-list-view", {
    title: "All Categories",
    categories: allCategories,
  });
});

module.exports = {
  categoryListGET,
};
