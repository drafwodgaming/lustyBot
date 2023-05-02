const { customTag } = require("../../functions/modals/setUpCustomTag");
const {
  customBackground,
} = require("../../functions/modals/setUpCustomBackground");
const customId = require("../../../config/customId.json");

module.exports = {
  data: {
    name: customId.menus.customCreateProfile,
  },
  async execute(interaction, client) {
    const value = interaction.values[0];

    switch (value) {
      case "firstOption":
        {
          const titleModal = "Background";
          const idModal = customId.modals.customBackground;
          await interaction.showModal(customBackground(idModal, titleModal));
        }
        break;
      case "secondOption":
        {
          const title = "Tag";
          const id = customId.modals.customTag;
          await interaction.showModal(customTag(id, title));
        }
        break;
    }
  },
};
