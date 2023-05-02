const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { embedSetup } = require("../functions/embedSetup");
const welcomeChannelSchema = require("../models/welcomeChannel");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");
const botColors = require("../../config/botColors.json");
const { settings } = require("../../config/commands.json");
const locales = require("../../config/locales");

module.exports = {
  //#region SlashComandBuilder
  data: new SlashCommandBuilder()
    .setName(settings.welcomeChannel.name)
    .setDescription(en.commands.welcomeChannel.selectWelcomeChannel)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(en.commands.welcomeChannel.setupChannel)
        .addChannelOption((option) =>
          option
            .setName(settings.channelOption.name)
            .setDescription(en.commands.welcomeChannel.channelOption)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
        .setDescription(en.commands.welcomeChannel.disableChannel)
    ),
  //#endregion
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, locale, options } = interaction;

    const errorCallCommand = locales[locale].logs.errors.errorCallCommand;

    const botColor = parseInt(botColors.default);
    const installColor = parseInt(botColors.succesGreen);
    const editColor = parseInt(botColors.editBlue);
    const errorColor = parseInt(botColors.errorRed);

    const subCommand = options.getSubcommand();
    const interactionChannel = options.getChannel("channel");
    const interactionGuildId = guild.id;

    switch (subCommand) {
      /**
       * ! --------------------------------
       * ! НАСТРОЙКА КАНАЛА ПРИВЕТСТВИЯ
       * ! --------------------------------
       */
      case settings.setup.name:
        {
          const welcomeChannel = await welcomeChannelSchema.findOne({
            guildId: interactionGuildId,
          });

          const editChannelDescription = locales[
            locale
          ].commands.welcomeChannel.editedChannel.replace(
            "%channelId",
            interactionChannel
          );

          const installedChannelDescription = locales[
            locale
          ].commands.welcomeChannel.installedChannel.replace(
            "%channelId",
            interactionChannel
          );

          if (welcomeChannel) {
            welcomeChannel.channelId = interactionChannel.id;
            welcomeChannel.guildId = interactionGuildId;
            await welcomeChannel.save();
            await interaction
              .reply({
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
              })
              .catch(() => {
                return interaction.editReply({
                  embeds: [
                    embedSetup(
                      botColor,
                      undefined,
                      undefined,
                      undefined,
                      errorCallCommand
                    ),
                  ],
                  ephemeral: true,
                });
              });
            return;
          }

          const newChannelId = new welcomeChannelSchema({
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
          const welcomeChannel = await welcomeChannelSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          const deletedChannel =
            locales[locale].commands.welcomeChannel.deletedChannel;

          if (welcomeChannel) {
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
