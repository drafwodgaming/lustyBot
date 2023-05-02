const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { embedSetup } = require("../functions/embedSetup");
const logChannelSchema = require("../models/logChannel");
const en = require("../../config/languages/en.json");
const botColors = require("../../config/botColors.json");
const { settings } = require("../../config/commands.json");
const locales = require("../../config/locales");

module.exports = {
  //#region SlashComandBuilder
  data: new SlashCommandBuilder()
    .setName(settings.logChannel.name)
    .setDescription(en.commands.logChannel.selectLogChannel)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(en.commands.logChannel.setupChannel)
        .addChannelOption((option) =>
          option
            .setName(settings.channelOption.name)
            .setDescription(en.commands.logChannel.channelOption)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
        .setDescription(en.commands.logChannel.disableChannel)
    ),
  //#endregion
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, locale, options } = interaction;

    const botColor = parseInt(botColors.default);
    const installColor = parseInt(botColors.succesGreen);
    const editColor = parseInt(botColors.editBlue);
    const errorColor = parseInt(botColors.errorRed);

    const subCommand = options.getSubcommand();
    const interactionChannel = options.getChannel(settings.channelOption.name);
    const interactionGuildId = guild.id;

    switch (subCommand) {
      /**
       * ! --------------------------------
       * ! НАСТРОЙКА КАНАЛА ЛОГОВ
       * ! --------------------------------
       */
      case settings.setup.name:
        {
          const logChannel = await logChannelSchema.findOne({
            guildId: interactionGuildId,
          });

          const editChannelDescription = locales[
            locale
          ].commands.logChannel.editedChannel.replace(
            "%channelId",
            interactionChannel
          );

          const installedChannelDescription = locales[
            locale
          ].commands.logChannel.installedChannel.replace(
            "%channelId",
            interactionChannel
          );

          if (logChannel) {
            logChannel.channelId = interactionChannel.id;
            logChannel.guildId = interactionGuildId;
            await logChannel.save();
            await interaction.reply({
              embeds: [
                embedSetup(
                  editColor,
                  undefined,
                  undefined,
                  undefined,
                  editChannelDescription
                ),
              ],
              ephemeral: true,
            });
            return;
          }
          const newChannelId = new logChannelSchema({
            channelId: interactionChannel.id,
            guildId: interactionGuildId,
          });
          await newChannelId.save();
          await interaction.reply({
            embeds: [
              embedSetup(
                installColor,
                undefined,
                undefined,
                undefined,
                installedChannelDescription
              ),
            ],
            ephemeral: true,
          });
        }
        break;

      case settings.disable.name:
        {
          const logChannel = await logChannelSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          const deletedChannel =
            locales[locale].commands.logChannel.deletedChannel;

          if (logChannel) {
            await interaction.reply({
              embeds: [
                embedSetup(
                  errorColor,
                  undefined,
                  undefined,
                  undefined,
                  deletedChannel
                ),
              ],
              ephemeral: true,
            });
            return;
          }
          await interaction.reply({ content: "Hai" });
        }
        break;
    }
  },
};
