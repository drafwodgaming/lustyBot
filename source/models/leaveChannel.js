const { Schema, model } = require("mongoose");

const leaveChannel = new Schema({
  channelId: String,
  guildId: String,
});

module.exports = model("leavechannels", leaveChannel);
