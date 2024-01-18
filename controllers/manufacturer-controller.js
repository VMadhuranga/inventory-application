const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

const manufacturerCreateGET = (req, res, next) => {
  res.render("manufacturer-form-view", {
    title: "Create Manufacturer",
  });
};

const manufacturerCreatePOST = [
  body("manufacturer-name", "Manufacturer name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer-description", "Manufacturer description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newManufacturer = new ManufacturerModel({
      name: req.body["manufacturer-name"],
      description: req.body["manufacturer-description"],
    });

    if (!errors.isEmpty()) {
      res.render("manufacturer-form-view", {
        title: "Create Manufacturer",
        manufacturer: newManufacturer,
        errors: errors.array(),
      });

      return;
    }

    await newManufacturer.save();
    res.redirect(newManufacturer.url);
  }),
];

const manufacturerUpdateGET = asyncHandler(async (req, res, next) => {
  const manufacturer = await ManufacturerModel.findById(req.params.id).exec();

  if (manufacturer === null) {
    const error = new Error("Manufacturer not found");
    error.status = 404;

    return next(error);
  }

  res.render("manufacturer-form-view", {
    title: "Update Manufacturer",
    manufacturer: manufacturer,
  });
});

const manufacturerUpdatePOST = [
  body("manufacturer-name", "Manufacturer name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer-description", "Manufacturer description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const manufacturer = new ManufacturerModel({
      name: req.body["manufacturer-name"],
      description: req.body["manufacturer-description"],
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("manufacturer-form-view", {
        title: "Create Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });

      return;
    }

    const updatedManufacturer = await ManufacturerModel.findByIdAndUpdate(
      req.params.id,
      manufacturer,
      {},
    );
    res.redirect(updatedManufacturer.url);
  }),
];

const manufacturerDeleteGET = asyncHandler(async (req, res, next) => {
  const [manufacturer, manufacturerProducts] = await Promise.all([
    ManufacturerModel.findById(req.params.id).exec(),
    ProductModel.find({ manufacturer: req.params.id }, "name").exec(),
  ]);

  if (manufacturer === null) {
    res.redirect("/manufacturers");
  }

  res.render("manufacturer-delete-view", {
    title: "Delete Manufacturer",
    manufacturer: manufacturer,
    manufacturerProducts: manufacturerProducts,
  });
});

const manufacturerDeletePost = async (req, res, next) => {
  const [manufacturer, manufacturerProducts] = await Promise.all([
    ManufacturerModel.findById(req.params.id).exec(),
    ProductModel.find({ manufacturer: req.params.id }, "name").exec(),
  ]);

  if (manufacturerProducts.length) {
    res.render("manufacturer-delete-view", {
      title: "Delete Manufacturer",
      manufacturer: manufacturer,
      manufacturerProducts: manufacturerProducts,
    });

    return;
  }

  await ManufacturerModel.findByIdAndDelete(req.body["manufacturer-id"]);
  res.redirect("/manufacturers");
};

module.exports = {
  manufacturerListGET,
  manufacturerDetailGET,
  manufacturerCreateGET,
  manufacturerCreatePOST,
  manufacturerUpdateGET,
  manufacturerUpdatePOST,
  manufacturerDeleteGET,
  manufacturerDeletePost,
};
