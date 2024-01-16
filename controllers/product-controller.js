const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const ProductModel = require("../models/product-model");
const ManufacturerModel = require("../models/manufacturer-model");
const CategoryModel = require("../models/category-model");
const SizeModel = require("../models/size-model");

const productList = asyncHandler(async (req, res, next) => {
  const allProducts = await ProductModel.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("product-list-view", {
    title: "All Products",
    products: allProducts,
  });
});

const productDetail = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id)
    .populate(["manufacturer", "categories", "availableSizes.size"])
    .exec();

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;

    return next(err);
  }

  res.render("product-detail-view", {
    title: product.name,
    product: product,
  });
});

const productCreateGET = asyncHandler(async (req, res, next) => {
  const [allManufacturers, allCategories, allSizes] = await Promise.all([
    ManufacturerModel.find({}).exec(),
    CategoryModel.find({}).exec(),
    SizeModel.find({}).exec(),
  ]);

  res.render("product-form-view", {
    title: "Create Product",
    manufacturers: allManufacturers,
    categories: allCategories,
    sizes: allSizes,
  });
});

const productCreatePOST = [
  (req, res, next) => {
    if (!Array.isArray(req.body["product-categories"])) {
      req.body["product-categories"] =
        typeof req.body["product-categories"] === "undefined"
          ? []
          : [req.body["product-categories"]];
    }

    next();
  },

  (req, res, next) => {
    if (!Array.isArray(req.body["product-sizes"])) {
      req.body["product-sizes"] =
        typeof req.body["product-sizes"] === "undefined"
          ? []
          : [req.body["product-sizes"]];
    }

    next();
  },

  (req, res, next) => {
    if (!Array.isArray(req.body["product-size-quantity"])) {
      req.body["product-size-quantity"] =
        typeof req.body["product-size-quantity"] === "undefined"
          ? []
          : [req.body["product-size-quantity"]];
    }

    next();
  },

  body("product-name", "Product name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product-description", "Product description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product-manufacturer", "Product manufacturer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product-categories", "Select at least one category")
    .isArray({ min: 1 })
    .escape(),
  body("product-sizes", "Select at least one size")
    .isArray({ min: 1 })
    .escape(),
  body("product-size-quantity", "Product quantity must not be empty")
    .isArray({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newProduct = new ProductModel({
      name: req.body["product-name"],
      description: req.body["product-description"],
      manufacturer: req.body["product-manufacturer"],
      categories: req.body["product-categories"],
    });

    const productSizes = req.body["product-sizes"];
    const productSizeQuantity = req.body["product-size-quantity"];

    productSizes.forEach((size, index) => {
      newProduct.availableSizes.push({
        size: size,
        quantity: productSizeQuantity[index],
      });
    });

    if (!errors.isEmpty()) {
      const [allManufacturers, allCategories, allSizes] = await Promise.all([
        ManufacturerModel.find({}).exec(),
        CategoryModel.find({}).exec(),
        SizeModel.find({}).exec(),
      ]);

      allCategories.forEach((category) => {
        if (newProduct.categories.includes(category._id)) {
          category.checked = true;
        }
      });

      allSizes.forEach((size) => {
        if (
          newProduct.availableSizes.find(({ size: selectedSize }) =>
            selectedSize.toString().includes(size._id),
          )
        ) {
          size.checked = true;
        }
      });

      res.render("product-form-view", {
        title: "Create Product",
        manufacturers: allManufacturers,
        categories: allCategories,
        sizes: allSizes,
        product: newProduct,
        errors: errors.array(),
      });

      return;
    } else {
      await newProduct.save();
      res.redirect(newProduct.url);
    }
  }),
];

const productUpdateGET = asyncHandler(async (req, res, next) => {
  const [product, allManufacturers, allCategories, allSizes] =
    await Promise.all([
      ProductModel.findById(req.params.id).exec(),
      ManufacturerModel.find({}).exec(),
      CategoryModel.find({}).exec(),
      SizeModel.find({}).exec(),
    ]);

  if (product === null) {
    const error = new Error("Product not fount");
    error.status = 404;

    return next(error);
  }

  allCategories.forEach((category) => {
    if (product.categories.includes(category._id)) {
      category.checked = true;
    }
  });

  allSizes.forEach((size) => {
    if (
      product.availableSizes.find(({ size: selectedSize }) =>
        selectedSize.toString().includes(size._id),
      )
    ) {
      size.checked = true;
    }
  });

  res.render("product-form-view", {
    title: "Update Product",
    product: product,
    manufacturers: allManufacturers,
    categories: allCategories,
    sizes: allSizes,
  });
});

const productUpdatePOST = [
  (req, res, next) => {
    if (!Array.isArray(req.body["product-categories"])) {
      req.body["product-categories"] =
        typeof req.body["product-categories"] === "undefined"
          ? []
          : [req.body["product-categories"]];
    }

    next();
  },

  (req, res, next) => {
    if (!Array.isArray(req.body["product-sizes"])) {
      req.body["product-sizes"] =
        typeof req.body["product-sizes"] === "undefined"
          ? []
          : [req.body["product-sizes"]];
    }

    next();
  },

  (req, res, next) => {
    if (!Array.isArray(req.body["product-size-quantity"])) {
      req.body["product-size-quantity"] =
        typeof req.body["product-size-quantity"] === "undefined"
          ? []
          : [req.body["product-size-quantity"]];
    }

    next();
  },

  body("product-name", "Product name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product-description", "Product description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product-manufacturer", "Product manufacturer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product-categories", "Select at least one category")
    .isArray({ min: 1 })
    .escape(),
  body("product-sizes", "Select at least one size")
    .isArray({ min: 1 })
    .escape(),
  body("product-size-quantity", "Product quantity must not be empty")
    .isArray({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new ProductModel({
      name: req.body["product-name"],
      description: req.body["product-description"],
      manufacturer: req.body["product-manufacturer"],
      categories: req.body["product-categories"],
      _id: req.params.id,
    });

    const productSizes = req.body["product-sizes"];
    const productSizeQuantity = req.body["product-size-quantity"];

    productSizes.forEach((size, index) => {
      product.availableSizes.push({
        size: size,
        quantity: productSizeQuantity[index],
      });
    });

    if (!errors.isEmpty()) {
      const [allManufacturers, allCategories, allSizes] = await Promise.all([
        ManufacturerModel.find({}).exec(),
        CategoryModel.find({}).exec(),
        SizeModel.find({}).exec(),
      ]);

      allCategories.forEach((category) => {
        if (product.categories.includes(category._id)) {
          category.checked = true;
        }
      });

      allSizes.forEach((size) => {
        if (
          product.availableSizes.find(({ size: selectedSize }) =>
            selectedSize.toString().includes(size._id),
          )
        ) {
          size.checked = true;
        }
      });

      res.render("product-form-view", {
        title: "Create Product",
        manufacturers: allManufacturers,
        categories: allCategories,
        sizes: allSizes,
        product: product,
        errors: errors.array(),
      });

      return;
    } else {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        product,
        {},
      );
      res.redirect(updatedProduct.url);
    }
  }),
];

module.exports = {
  productList,
  productDetail,
  productCreateGET,
  productCreatePOST,
  productUpdateGET,
  productUpdatePOST,
};
