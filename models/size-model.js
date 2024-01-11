const mongoose = require("mongoose");

const { Schema } = mongoose;

const SizeSchema = new Schema({
  type: { type: String, required: true },
});

SizeSchema.virtual("url").get(function () {
  return `/size/${this._id}`;
});

module.exports = mongoose.model("Size", SizeSchema);
