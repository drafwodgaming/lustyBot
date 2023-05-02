const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const { embedSetup } = require("../functions/embedSetup");
const botColors = require("../../config/botColors.json");
const { automod } = require("../../config/commands.json");
const locales = require("../../config/locales");

module.exports = {
  //#region SlashCommandBuilder
  developer: true,
  data: new SlashCommandBuilder()
    .setName(automod.name)
    .setDescription(en.commands.automod.description)
    .setDescriptionLocalizations({
      ru: ru.commands.automod.description,
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName(automod.spamMessages)
        .setDescription(en.commands.automod.spamMessages)
        .setDescriptionLocalizations({
          ru: ru.commands.automod.spamMessages,
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(automod.spamMentions)
        .setDescription(en.commands.automod.spamMentionsNumber)
        .setDescriptionLocalizations({
          ru: ru.commands.automod.spamMentionsNumber,
        })
        .addIntegerOption((option) =>
          option
            .setName(automod.spamMentionsNumber)
            .setDescription(en.commands.automod.spamMentionsNumber)
            .setDescriptionLocalizations({
              ru: ru.commands.automod.spamMentionsNumber,
            })
            .setRequired(true)
        )
    ),
  //#endregion
  /**
   * @param {ChatInputCommandInteraction} interaction
   */ async execute(interaction) {
    const { guild, options, locale } = interaction;
    const subCommand = options.getSubcommand();
    const number = options.getInteger(automod.spamMentionsNumber);
    const loadingRule = locales[locale].commands.automod.loadingRule;
    const blueColor = parseInt(botColors.editBlue);

    switch (subCommand) {
      case automod.spamMessages:
        const description =
          locales[locale].commands.automod.spamMessagesCreated;
        await interaction.reply({
          content: loadingRule,
          ephemeral: true,
        });

        const rule1 = await guild.autoModerationRules
          .create({
            name: locales[locale].commands.automod.spamMessagesRuleName,
            creatorId: "598918368719798296",
            enabled: true,
            eventType: 1,
            triggerType: 3,
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  customMessage: locales[locale].commands.automod.blockMessage,
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              console.log(err);
              await interaction.editReply({ content: `${err}` });
            }, 2000);
          });
        setTimeout(async () => {
          if (!rule1) return;
          await interaction.editReply({
            content: ` `,
            embeds: [
              embedSetup(
                blueColor,
                undefined,
                undefined,
                undefined,
                description
              ),
            ],
          });
        }, 3000);
        break;

      case automod.spamMentions:
        await interaction.reply({
          content: loadingRule,
          ephemeral: true,
        });

        const rule2 = await guild.autoModerationRules
          .create({
            name: locales[locale].commands.automod.spamMentionsRuleName,
            creatorId: "598918368719798296",
            enabled: true,
            eventType: 1,
            triggerType: 5,
            triggerMetadata: {
              mentionTotalLimit: number,
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSecond: 10,
                  customMessage: locales[locale].commands.automod.blockMessage,
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              console.log(err);
              await interaction.editReply({ content: `${err}` });
            }, 2000);
          });
        setTimeout(async () => {
          if (!rule2) return;
        }, 3000);

        break;
    }
  },
};
