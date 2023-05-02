const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

function customCreateProfile(customCreateProfile) {
  const menu = new StringSelectMenuBuilder(customCreateProfile)
    .setCustomId(customCreateProfile)
    .setOptions(
      new StringSelectMenuOptionBuilder({
        label: "BACKGROUND",
        value: "firstOption",
      }),
      new StringSelectMenuOptionBuilder({
        label: "TAG",
        value: "secondOption",
      })
    );
  const menuBuilder = new ActionRowBuilder().addComponents(menu);

  return menuBuilder;
}
module.exports = { customCreateProfile };
