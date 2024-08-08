const mongoose = require("mongoose");

const fileContentSchema = new mongoose.Schema(
  {
    fileContent: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FileContent", fileContentSchema);
