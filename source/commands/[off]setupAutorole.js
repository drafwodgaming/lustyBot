const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  roleMention,
} = require("discord.js");
const mustache = require("mustache");
const { embedSetup } = require("../functions/embedSetup");
const autoRoleSchema = require("../models/autoRole");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");
const botColors = require("../../config/botColors.json");
const { settings } = require("../../config/commands.json");

module.exports = {
  //#region SlashComandBuilder
  data: new SlashCommandBuilder()
    .setName(settings.autoRole.name)
    .setDescription(
      en.commands.settings.selectSettings.description.replace(
        "%settings",
        "autorole"
      )
    )
    .setDescriptionLocalizations({
      ru: ru.commands.settings.selectSettings.description.replace(
        "%settings",
        "autorole"
      ),
      uk: uk.commands.settings.selectSettings.description.replace(
        "%settings",
        "autorole"
      ),
    })
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(
          en.commands.settings.setup.desciption.replace("%settings", "autorole")
        )
        .setDescriptionLocalizations({
          ru: ru.commands.settings.setup.desciption.replace(
            "%settings",
            "autorole"
          ),
          uk: uk.commands.settings.setup.desciption.replace(
            "%settings",
            "autorole"
          ),
        })
        .addRoleOption((option) =>
          option
            .setName(settings.roleOption.name)
            .setDescription(
              en.commands.settings.option.description.replace(
                "%settings",
                "autorole"
              )
            )
            .setDescriptionLocalizations({
              ru: ru.commands.settings.option.description.replace(
                "%settings",
                "autorole"
              ),
              uk: uk.commands.settings.option.description.replace(
                "%settings",
                "autorole"
              ),
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
        .setDescription(
          en.commands.settings.disable.desciption.replace(
            "%settings",
            "autorole"
          )
        )
        .setDescriptionLocalizations({
          ru: ru.commands.settings.disable.desciption.replace(
            "%settings",
            "autorole"
          ),
          uk: uk.commands.settings.disable.desciption.replace(
            "%settings",
            "autorole"
          ),
        })
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
          ].embeds.autoRole.description.editedRole.replace(
            "%roleId",
            interactionAutoRole
          );

          const installedRoleDescription = locales[
            locale
          ].embeds.autoRole.description.installedRole.replace(
            "%roleId",
            interactionAutoRole
          );

          if (autoRole) {
            autoRole.roleId = interactionAutoRole.id;
            autoRole.guildId = interactionGuildId;
            await autoRole.save();
            await interaction
              .reply({
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
              })
              .catch((err) => {
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
          const newAutoRoleId = new autoRoleSchema({
            roleId: interactionAutoRole.id,
            guildId: interactionGuildId,
          });
          await newAutoRoleId.save();
          await interaction
            .reply({
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
            })
            .catch((err) => {
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
        }
        break;

      case settings.disable.name:
        {
          const autoRole = await autoRoleSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          const deletedRole =
            locales[locale].embeds.autoRole.description.deletedRole;

          if (autoRole) {
            await interaction
              .reply({
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
              })
              .catch((err) => {
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
          await interaction.reply({ content: "Hai" });
        }
        break;
    }
  },
};
