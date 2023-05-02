const {
  Events,
  AuditLogEvent,
  ChatInputCommandInteraction,
  Client,
  channelMention,
} = require("discord.js");
const botColors = require("../../config/botColors.json");
const { embedSetup } = require("../functions/embedSetup");
const { stripIndents } = require("common-tags");
const logChannelSchema = require("../models/logChannel");
const en = require("../../config/languages/en.json");
/**
 * @param {Message} message
 * @param {Client} client
 */
module.exports = {
  name: Events.MessageDelete,
  async execute(message, client) {
    const interactionChannelId = await logChannelSchema.findOne({
      guildId: message.guild.id,
    });
    if (!interactionChannelId) return;
    const logChannel = message.guild.channels.cache.find(
      (channel) => channel.id === interactionChannelId.channelId
    );
    if (!logChannel) return;

    message.guild
      .fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        // limit: 1,
      })
      .then(async (audit) => {
        const { executor } = audit.entries.first();
        const messageContent = message.content;
        const messageChannelName = message.channel.name;
        const messageChannelId = message.channel.id;

        const messageDeletedTitle = en.events.logMessageDelete.title;
        const messageDeletedDescription = `${stripIndents`${en.events.logMessageDelete.description.channelName
          .replace("%channelName", messageChannelName)
          .replace("%channelId", channelMention(messageChannelId))}
        ${en.events.logMessageDelete.description.deletedBy.replace(
          "%executor",
          executor
        )}`}`;
        const messageDeeleteFiled = [
          {
            name: en.events.logMessageDelete.fields.name,
            value: messageContent,
          },
        ];
        const botColor = parseInt(botColors.errorRed);
        const timestamp = new Date().toISOString();
        const footer = {
          text: client.user.tag,
          iconUrl: client.user.displayAvatarURL(),
        };
        const authorMessage = {
          name: executor.tag,
          iconUrl: executor.displayAvatarURL({ dynamic: true }),
        };
        await logChannel
          .send({
            embeds: [
              embedSetup(
                botColor,
                messageDeletedTitle,
                undefined,
                authorMessage,
                messageDeletedDescription,
                undefined,
                messageDeeleteFiled,
                undefined,
                timestamp,
                footer
              ),
            ],
          })
          .catch((err) => {
            return;
          });
      });
  },
};
