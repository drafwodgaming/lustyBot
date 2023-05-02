const {
  Events,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const consoleLogs = require("../../config/consoleLogs.json");
const { embedSetup } = require("../functions/embedSetup");
const botColors = require("../../config/botColors.json");
const botConfig = require("../../config/botConfig.json");
const locales = require("../../config/locales");

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    const { locale } = interaction;
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      const developerOnly = locales[locale].events.developerOnly;
      const botColor = botColors.default;
      if (command.developer && interaction.user.id !== botConfig.onwerId)
        return interaction.reply({
          embeds: [
            embedSetup(
              botColor,
              undefined,
              undefined,
              undefined,
              developerOnly
            ),
          ],
          ephemeral: true,
        });

      await command.execute(interaction, client);
    } else if (interaction.isModalSubmit()) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return;

      await modal.execute(interaction, client);
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return;

      await button.execute(interaction, client);
    } else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const selectMenu = selectMenus.get(customId);

      if (!selectMenu) return;

      await selectMenu.execute(interaction, client);
    }
  },
  name: Events.InteractionCreate,
};
