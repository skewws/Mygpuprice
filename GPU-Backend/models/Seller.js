const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Seller", SellerSchema);
