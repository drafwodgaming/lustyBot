const { Schema, model } = require("mongoose");

const welcomeChannelId = new Schema({
  channelId: String,
  guildId: String,
});

module.exports = model("welcomechannels", welcomeChannelId);
