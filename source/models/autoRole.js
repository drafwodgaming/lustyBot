const { Schema, model } = require("mongoose");

const autoRole = new Schema({
  roleId: String,
  guildId: String,
});

module.exports = model("autoroles", autoRole);
