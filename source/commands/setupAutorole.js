const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  roleMention,
} = require("discord.js");
const { embedSetup } = require("../functions/embedSetup");
const autoRoleSchema = require("../models/autoRole");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");
const botColors = require("../../config/botColors.json");
const { settings } = require("../../config/commands.json");
const locales = require("../../config/locales");

module.exports = {
  //#region SlashComandBuilder
  data: new SlashCommandBuilder()
    .setName(settings.autoRole.name)
    .setDescription(en.commands.autoRole.selectAutorole)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(en.commands.autoRole.setupAutorole)
        .addRoleOption((option) =>
          option
            .setName(settings.roleOption.name)
            .setDescription(en.commands.autoRole.roleOption)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
        .setDescription(en.commands.autoRole.disableAutorole)
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
    const embedColor = parseInt(botColors.errorRed);

    const subCommand = options.getSubcommand();
    const interactionAutoRole = options.getRole("role");
    const interactionGuildId = guild.id;

    switch (subCommand) {
      /**
       * ! --------------------------------
       * ! НАСТРОЙКА АВТОМАТИЧЕСКОЙ РОЛИ
       * ! --------------------------------
       */
      case settings.setup.name:
        {
          const autoRole = await autoRoleSchema.findOne({
            guildId: interactionGuildId,
          });

          const editRoleDescription = locales[
            locale
          ].commands.autoRole.editedRole.replace(
            "%roleId",
            interactionAutoRole
          );

          const installedRoleDescription = locales[
            locale
          ].commands.autoRole.installedRole.replace(
            "%roleId",
            interactionAutoRole
          );

          if (autoRole) {
            autoRole.roleId = interactionAutoRole.id;
            autoRole.guildId = interactionGuildId;
            await autoRole.save();
            await interaction.reply({
              embeds: [
                embedSetup(
                  editColor,
                  undefined,
                  undefined,
                  undefined,
                  editRoleDescription
                ),
              ],
              ephemeral: true,
            });
            return;
          }
          const newAutoRoleId = new autoRoleSchema({
            roleId: interactionAutoRole.id,
            guildId: interactionGuildId,
          });
          await newAutoRoleId.save();
          await interaction.reply({
            embeds: [
              embedSetup(
                installColor,
                undefined,
                undefined,
                undefined,
                installedRoleDescription
              ),
            ],
            ephemeral: true,
          });
        }
        break;

      case settings.disable.name:
        {
          const autoRole = await autoRoleSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          const deletedRole = locales[locale].commands.autoRole.deletedRole;

          if (autoRole) {
            await interaction.reply({
              embeds: [
                embedSetup(
                  embedColor,
                  undefined,
                  undefined,
                  undefined,
                  deletedRole
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
