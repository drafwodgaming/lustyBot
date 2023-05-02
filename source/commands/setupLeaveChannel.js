const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { embedSetup } = require("../functions/embedSetup");
const leaveChannelSchema = require("../models/leaveChannel");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");
const botColors = require("../../config/botColors.json");
const { settings } = require("../../config/commands.json");
const locales = require("../../config/locales");

module.exports = {
  //#region SlashComandBuilder
  data: new SlashCommandBuilder()
    .setName(settings.leaveChannel.name)
    .setDescription(en.commands.leaveChannel.selectLeaveChannel)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(en.commands.leaveChannel.setupChannel)
        .addChannelOption((option) =>
          option
            .setName(settings.channelOption.name)
            .setDescription(en.commands.leaveChannel.channelOption)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
        .setDescription(en.commands.leaveChannel.disableChannel)
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
    const interactionChannel = options.getChannel("channel");
    const interactionGuildId = guild.id;

    switch (subCommand) {
      //#region Leave Channel
      /**
       * ! --------------------------------
       * ! НАСТРОЙКА КАНАЛА ПРОЩАНИЯ
       * ! --------------------------------
       */
      case settings.setup.name:
        {
          const leaveChannel = await leaveChannelSchema.findOne({
            guildId: interactionGuildId,
          });

          const editChannelDescription = locales[
            locale
          ].commands.leaveChannel.editedChannel.replace(
            "%channelId",
            interactionChannel
          );

          const installedChannelDescription = locales[
            locale
          ].commands.leaveChannel.installedChannel.replace(
            "%channelId",
            interactionChannel
          );
          if (leaveChannel) {
            leaveChannel.channelId = interactionChannel.id;
            leaveChannel.guildId = interactionGuildId;
            await leaveChannel.save();
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
          const newChannelId = new leaveChannelSchema({
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
          const leaveChannel = await leaveChannelSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          const deletedChannel =
            locales[locale].commands.leaveChannel.deletedChannel;

          if (leaveChannel) {
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
      //#endregion
    }
  },
};
