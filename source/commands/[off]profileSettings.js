const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  AttachmentBuilder,
} = require("discord.js");
const profileSettingsSchema = require("../models/profileArt");
const { profileImage } = require("discord-arts");
const {
  customCreateProfile,
} = require("../functions/menus/setUpCustomProfileMenu");
const customId = require("../../config/customId.json");

module.exports = {
  //#region SlashCommandBuilder
  developer: true,
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Setup your profile")
    .addSubcommand((subcommand) =>
      subcommand.setName("create").setDescription("Show your profile")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("show").setDescription("Show your profile")
    ),
  //#endregion
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const interactionUserId = interaction.user.id;
    const subCommand = options.getSubcommand();
    const customProfile = customId.menus.customCreateProfile;

    switch (subCommand) {
      case "create":
        {
          await interaction.reply({
            components: [customCreateProfile(customProfile)],
            ephemeral: true,
          });
        }
        break;
      case "show":
        {
          {
            const profileSettings = await profileSettingsSchema.findOne({
              userId: interactionUserId,
            });

            if (!profileSettings)
              return interaction.reply({
                content: "profile not found",
                ephemeral: true,
              });

            const showProfileBuffer = await profileImage(interactionUserId, {
              customTag: profileSettings.customTag,
              customBackground: profileSettings.customBackground,
              usernameColor: profileSettings.userNameColor,
              tagColor: profileSettings.tagColor,
              borderColor: profileSettings.borderColor,
            });
            const showImageAttachment = new AttachmentBuilder(
              showProfileBuffer
            );
            await interaction.reply({ files: [showImageAttachment] });
          }
        }
        break;
    }
  },
};
