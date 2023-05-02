const { SlashCommandBuilder, bold } = require("discord.js");
const { embedSetup } = require("../functions/embedSetup");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const botColors = require("../../config/botColors.json");
const { help } = require("../../config/commands.json");
const locales = require("../../config/locales");

module.exports = {
  //#region SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName(help.name)
    .setDescription(en.commands.help.description)
    .setDescriptionLocalizations({
      ru: ru.commands.help.description,
    }),
  //#endregion
  async execute(interaction) {
    const { locale } = interaction;
    const embedTitle = locales[locale].commands.help.title;
    const embedDescription = interaction.client.commandsArray
      .map((command) => `/${bold(command.name)} \n ${command.description}\n`)
      .join("\n");

    const botColor = parseInt(botColors.default);
    await interaction.reply({
      embeds: [
        embedSetup(
          botColor,
          embedTitle,
          undefined,
          undefined,
          embedDescription
        ),
      ],
      ephemeral: true,
    });
  },
};
