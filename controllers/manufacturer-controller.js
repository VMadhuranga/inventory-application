const asyncHandler = require("express-async-handler");

const ManufacturerModel = require("../models/manufacturer-model");
const ProductModel = require("../models/product-model");

const manufacturerListGET = asyncHandler(async (req, res, next) => {
  const allManufacturers = await ManufacturerModel.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("manufacturer-list-view", {
    title: "All Manufacturers",
    manufacturers: allManufacturers,
  });
});

const manufacturerDetailGET = asyncHandler(async (req, res, next) => {
  const [manufacturer, manufacturerProducts] = await Promise.all([
    ManufacturerModel.findById(req.params.id).exec(),
    ProductModel.find({ manufacturer: req.params.id }, "name").exec(),
  ]);

  if (manufacturer === null) {
    const error = new Error("Manufacturer not found");
    error.status = 404;

    return next(error);
  }

  res.render("manufacturer-detail-view", {
    title: manufacturer.name,
    manufacturer: manufacturer,
    manufacturerProducts: manufacturerProducts,
  });
});

module.exports = {
  manufacturerListGET,
  manufacturerDetailGET,
};
