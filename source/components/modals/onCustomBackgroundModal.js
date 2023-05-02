const profileSettingsSchema = require("../../models/profileArt");
const customId = require("../../../config/customId.json");

module.exports = {
  data: {
    name: customId.modals.customBackground,
  },
  async execute(interaction, client) {
    await interaction.deferReply();
    const interactionUserId = interaction.user.id;

    const interactionBackground = interaction.fields.getTextInputValue(
      customId.modals.customBackground
    );

    const profileSettings = await profileSettingsSchema.findOne({
      userId: interactionUserId,
    });

    if (profileSettings) {
      profileSettings.customBackground = interactionBackground;
      profileSettings.userId = interactionUserId;

      await profileSettings.save();
      await interaction.editReply({
        content: "Фон изменён",
        ephemeral: true,
      });
      return;
    }
    const newProfileSettings = new profileSettingsSchema({
      customBackground: interactionBackground,
      userId: interactionUserId,
    });
    await newProfileSettings.save();
    await interaction.editReply({
      content: "Фон установлен",
      ephemeral: true,
    });
  },
};
