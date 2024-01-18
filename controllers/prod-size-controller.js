const asyncHandler = require("express-async-handler");

const SizeModel = require("../models/size-model");

const prodSizeListGET = asyncHandler(async (req, res, next) => {
  const allSizes = await SizeModel.find({}).sort({ type: 1 }).exec();

  res.render("size-list-view", {
    title: "All Sizes",
    sizes: allSizes,
  });
});

module.exports = {
  prodSizeListGET,
};
