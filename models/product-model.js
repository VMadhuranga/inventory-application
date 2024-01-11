const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  categories: [
    { type: Schema.Types.ObjectId, ref: "Category", required: true },
  ],
  availableSizes: [
    {
      size: { type: Schema.Types.ObjectId, ref: "Size", required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

ProductSchema.virtual("inStock").get(function () {
  return this.availableSizes.every((size) => size.quantity > 0);
});

ProductSchema.virtual("url").get(function () {
  return `/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
