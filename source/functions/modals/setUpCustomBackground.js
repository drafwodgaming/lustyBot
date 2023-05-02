const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const customId = require("../../../config/customId.json");

function customBackground(customBackgroundId, customBackgroundLabel) {
  const modal = new ModalBuilder()
    .setCustomId(customBackgroundId)
    .setTitle(customBackgroundLabel);

  const customBackgrounInput = new TextInputBuilder()
    .setCustomId(customId.modals.customBackground)
    .setLabel("BACKGROUND")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Custom background");

  const customBackgroundRow = new ActionRowBuilder().addComponents(
    customBackgrounInput
  );

  modal.addComponents(customBackgroundRow);

  return modal;
}
module.exports = { customBackground };
