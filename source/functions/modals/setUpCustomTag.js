const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const customId = require("../../../config/customId.json");

function customTag(modalId, title) {
  const modal = new ModalBuilder().setCustomId(modalId).setTitle(title);
  const customTagInput = new TextInputBuilder()
    .setCustomId(customId.modals.customTag)
    .setLabel("TAG")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Custom Tag");

  const customTagRow = new ActionRowBuilder().addComponents(customTagInput);

  modal.addComponents(customTagRow);

  return modal;
}
module.exports = { customTag };
