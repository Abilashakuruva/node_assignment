const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  id: Number,
  userId: Number,
  title: String,
  body: String,
});

module.exports = mongoose.model("Post", postSchema);
