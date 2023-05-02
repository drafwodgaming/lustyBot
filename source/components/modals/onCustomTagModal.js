const profileSettingsSchema = require("../../models/profileArt");
const { profileImage } = require("discord-arts");
const customTag = require("../../../config/customId.json");

module.exports = {
  data: {
    name: customTag.modals.customTag,
  },
  async execute(interaction) {
    const interactionUserId = interaction.user.id;

    const interactionTag = interaction.fields.getTextInputValue(
      customTag.modals.customBackgroundModal
    );

    const profileSettings = await profileSettingsSchema.findOne({
      userId: interactionUserId,
    });

    if (profileSettings) {
      profileSettings.customTag = interactionTag;
      profileSettings.userId = interactionUserId;

      await profileSettings.save();
      await interaction.reply({
        content: "Тэг изменён",
        ephemeral: true,
      });
      return;
    }
    const newProfileSettings = new profileSettingsSchema({
      customTag: interactionTag,
      userId: interactionUserId,
    });
    await newProfileSettings.save();
    await interaction.reply({ content: "Тэг установлен", ephemeral: true });
  },
};
