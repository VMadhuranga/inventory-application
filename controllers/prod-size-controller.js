const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

const prodSizeCreateGET = (req, res, next) => {
  res.render("size-form-view", {
    title: "Create Size",
  });
};

const prodSizeCreatePOST = [
  body("size-type", "Size type must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newSize = new SizeModel({ type: req.body["size-type"] });

    if (!errors.isEmpty()) {
      res.render("size-form-view", {
        title: "Create Size",
        size: newSize,
        errors: errors.array(),
      });

      return;
    }

    await newSize.save();
    res.redirect(newSize.url);
  }),
];

const prodSizeUpdateGET = asyncHandler(async (req, res, next) => {
  const size = await SizeModel.findById(req.params.id).exec();

  if (size === null) {
    const error = new Error("Size not found");
    error.status = 404;

    return next(error);
  }

  res.render("size-form-view", {
    title: "Update Size",
    size: size,
  });
});

const prodSizeUpdatePOST = [
  body("size-type", "Size type must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const size = new SizeModel({
      type: req.body["size-type"],
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("size-form-view", {
        title: "Update Size",
        size: size,
        errors: errors.array(),
      });

      return;
    }

    const updatedSize = await SizeModel.findByIdAndUpdate(
      req.params.id,
      size,
      {},
    );
    res.redirect(updatedSize.url);
  }),
];

module.exports = {
  prodSizeListGET,
  prodSizeDetailGET,
  prodSizeCreateGET,
  prodSizeCreatePOST,
  prodSizeUpdateGET,
  prodSizeUpdatePOST,
};
