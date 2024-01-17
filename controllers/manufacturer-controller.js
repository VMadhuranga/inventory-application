const asyncHandler = require("express-async-handler");

const ManufacturerModel = require("../models/manufacturer-model");

const manufacturerListGET = asyncHandler(async (req, res, next) => {
  const allManufacturers = await ManufacturerModel.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("manufacturer-list-view", {
    title: "All Manufacturers",
    manufacturers: allManufacturers,
  });
});

module.exports = {
  manufacturerListGET,
};
