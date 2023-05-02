const { Events } = require("discord.js");
const leaveChannelSchema = require("../models/leaveChannel");
const {
  cardLeaveMessage,
} = require("../functions/canvases/setUpCardLeaveMessage");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const { guild } = member;
    const interactionChannelId = await leaveChannelSchema.findOne({
      guildId: guild.id,
    });

    if (!interactionChannelId) return;

    const leaveChannel = guild.channels.cache.find(
      (channel) => channel.id === interactionChannelId.channelId
    );

    if (!leaveChannel || user.bot) return;

    const leaveMessage = await cardLeaveMessage(member);
    await leaveChannel.send({ files: [leaveMessage] }).catch((err) => {
      return;
    });
  },
};
