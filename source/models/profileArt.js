const { Schema, model } = require("mongoose");

const profileImage = new Schema({
  customTag: String,
  customBackground: String,
  userNameColor: String,
  tagColor: String,
  borderColor: String,
  userId: String,
});

module.exports = model("ProfileImage", profileImage);
