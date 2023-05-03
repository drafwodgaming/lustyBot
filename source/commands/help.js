const { SlashCommandBuilder, bold } = require("discord.js");
const { embedSetup } = require("../functions/embedSetup");
const botColors = require("../../config/botColors.json");
const { help } = require("../../config/commands.json");
const locales = require("../../config/locales");

const commandDescription = {
  "en-US": locales["en-US"].commands.help.description,
  "en-GB": locales["en-GB"].commands.help.description,
  ru: locales["ru"].commands.help.description,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(help.name)
    .setDescription(commandDescription["en-US"])
    .setDescriptionLocalizations(commandDescription),
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
