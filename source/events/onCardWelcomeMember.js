const { Events } = require("discord.js");
const welcomeChannelSchema = require("../models/welcomeChannel");
const {
  cardWelcomeMessage,
} = require("../functions/canvases/setUpCardWelcomeMessage");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const { guild, user } = member;

    const interactionChannelId = await welcomeChannelSchema.findOne({
      guildId: guild.id,
    });

    if (!interactionChannelId) return;

    const welcomeChannel = guild.channels.cache.find(
      (channel) => channel.id === interactionChannelId.channelId
    );
    if (!welcomeChannel || user.bot) return;

    const welcomeMessage = await cardWelcomeMessage(member);
    await welcomeChannel.send({ files: [welcomeMessage] }).catch((err) => {
      return;
    });
  },
};
