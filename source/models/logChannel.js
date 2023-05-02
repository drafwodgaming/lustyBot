const { Schema, model } = require("mongoose");

const logChannelId = new Schema({
  channelId: String,
  guildId: String,
});

module.exports = model("logchannels", logChannelId);
