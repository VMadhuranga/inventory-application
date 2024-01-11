#! /usr/bin/env node

console.log(
  'This script populates some test products, manufacturers, categories and sizes to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product-model");
const Manufacturer = require("./models/manufacturer-model");
const Category = require("./models/category-model");
const Size = require("./models/size-model");

const products = [];
const manufacturers = [];
const categories = [];
const sizes = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createSizes();
  await createCategories();
  await createManufacturers();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// sizes[0] will always be the Small size, regardless of the order
// in which the elements of promise.all's argument complete.
async function sizeCreate(index, type) {
  const newSize = new Size({ type: type });
  await newSize.save();
  sizes[index] = newSize;
  console.log(`Added size: ${type}`);
}

async function categoryCreate(index, name) {
  const newCategory = new Category({ name: name });
  await newCategory.save();
  categories[index] = newCategory;
  console.log(`Added category: ${name}`);
}

async function manufacturerCreate(index, name, description) {
  const newManufacturer = new Manufacturer({
    name: name,
    description: description,
  });
  await newManufacturer.save();
  manufacturers[index] = newManufacturer;
  console.log(`Added manufacturer: ${name}`);
}

async function productCreate(
  index,
  name,
  description,
  manufacturer,
  categories,
  availableSizes,
) {
  const newProduct = new Product({
    name: name,
    description: description,
    manufacturer: manufacturer,
    categories: categories,
    availableSizes: availableSizes,
  });
  await newProduct.save();
  products[index] = newProduct;
  console.log(`Added product: ${name}`);
}

async function createSizes() {
  console.log("Adding sizes");
  await Promise.all([
    sizeCreate(0, "Small"),
    sizeCreate(1, "Medium"),
    sizeCreate(2, "Large"),
  ]);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Men's wear"),
    categoryCreate(1, "Women's wear"),
    categoryCreate(2, "Children's wear"),
    categoryCreate(3, "Casual wear"),
    categoryCreate(4, "Formal wear"),
  ]);
}

async function createManufacturers() {
  console.log("Adding manufacturers");
  await Promise.all([
    manufacturerCreate(
      0,
      "John Doe Apparels",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt augue interdum velit euismod in pellentesque.",
    ),
    manufacturerCreate(
      1,
      "Mary Jane Apparels",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt augue interdum velit euismod in pellentesque.",
    ),
    manufacturerCreate(
      2,
      "Isaac Bolton Apparels",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt augue interdum velit euismod in pellentesque.",
    ),
    manufacturerCreate(
      3,
      "Bob Dash Apparels",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt augue interdum velit euismod in pellentesque.",
    ),
    manufacturerCreate(
      4,
      "Jim Bruce Apparels",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt augue interdum velit euismod in pellentesque.",
    ),
  ]);
}

async function createProducts() {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      0,
      "T-Shirt",
      "Lorem ipsum dolor sit amet",
      manufacturers[0],
      [categories[0]],
      [{ size: sizes[0], quantity: 10 }],
    ),
    productCreate(
      1,
      "Dress Shirt",
      "Lorem ipsum dolor sit amet",
      manufacturers[4],
      [categories[0], categories[4]],
      [{ size: sizes[1], quantity: 40 }],
    ),
    productCreate(
      2,
      "Trouser",
      "Lorem ipsum dolor sit amet",
      manufacturers[0],
      [categories[1]],
      [
        { size: sizes[1], quantity: 40 },
        { size: sizes[2], quantity: 20 },
      ],
    ),
    productCreate(
      3,
      "Frock",
      "Lorem ipsum dolor sit amet",
      manufacturers[1],
      [categories[1]],
      [{ size: sizes[1], quantity: 10 }],
    ),
    productCreate(
      4,
      "Short",
      "Lorem ipsum dolor sit amet",
      manufacturers[1],
      [categories[0], categories[3]],
      [
        { size: sizes[0], quantity: 15 },
        { size: sizes[1], quantity: 10 },
      ],
    ),
  ]);
}
