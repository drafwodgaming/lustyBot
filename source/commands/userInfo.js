const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  inlineCode,
} = require("discord.js");
const moment = require("moment");
const { embedSetup } = require("../functions/embedSetup");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");
const botColors = require("../../config/botColors.json");
const locales = require("../../config/locales");
const { profileImage } = require("discord-arts");
const { addBadges } = require("../functions/userBadges");
const { userInfo } = require("../../config/commands.json");

module.exports = {
  //#region SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName(userInfo.name)
    .setDescription(en.commands.userInfo.description)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName(userInfo.userOption)
        .setDescription(en.commands.userInfo.userOption)
        .setRequired(false)
    ),
  //#endregion
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const { locale, options, member } = interaction;
    moment.updateLocale(locales[locale].time.moment.momentLocale, {
      weekdays: locales[locale].time.moment.momentWeekList.split("_"),
    });

    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: ПОЛЬЗОВАТЕЛЯ
     * ! --------------------------------
     */
    const targetUser = options.getMember(userInfo.userOption) || member;

    const profileBuffer = await profileImage(targetUser.id, {
      badgesFrame: true,
    });
    const imageAttachment = new AttachmentBuilder(profileBuffer, {
      name: "profile.png",
    });

    const userCreatedAt = moment(targetUser.user.createdAt).format(
      locales[locale].time.defaultTimeFormat
    );

    const statusList = {
      online: locales[locale].presence.online,
      idle: locales[locale].presence.idle,
      offline: locales[locale].presence.offline,
      dnd: locales[locale].presence.dnd,
    };

    const userBadges = targetUser.user.flags.toArray();

    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: УЧАСТНИКА НА СЕРВЕРЕ
     * ! --------------------------------
     */
    const memberJoinedTime = moment(targetUser.joinedAt).format(
      locales[locale].time.defaultTimeFormat
    );
    const memberRoles = targetUser.roles.cache
      .map((role) => role)
      .sort((a, b) => b.position - a.position)
      .map((role) => role)
      .slice(0, 3)
      .join(" ");

    const userBadgesDescription = `${addBadges(userBadges).join(" ")}`;
    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: EMBED
     * ! --------------------------------
     */
    const embedTitle = locales[locale].commands.userInfo.title;
    const embedFields = [
      {
        name: locales[locale].commands.userInfo.createdAt,
        value: locales[locale].commands.userInfo.createdTime.replace(
          "%createdAt",
          inlineCode(userCreatedAt)
        ),
        inline: false,
      },
      {
        name: locales[locale].commands.userInfo.joinedAt,
        value: locales[locale].commands.userInfo.joinedTime.replace(
          "%memberJoinedTime",
          inlineCode(memberJoinedTime)
        ),
        inline: true,
      },
      {
        name: locales[locale].commands.userInfo.statusLabel,
        value: locales[locale].commands.userInfo.userStatus.replace(
          "%statusList",
          statusList[
            targetUser.presence
              ? targetUser.presence.status
              : locales[locale].bot.presence.offline
          ]
        ),
        inline: true,
      },
      {
        name: locales[locale].commands.userInfo.memberRoles,
        value: memberRoles || locales[locale].commands.userInfo.emptyRolesList,
      },
    ];
    const botColor = parseInt(botColors.default);

    const imageEmbed = {
      url: "attachment://profile.png",
    };
    await interaction.editReply({
      embeds: [
        embedSetup(
          botColor,
          embedTitle,
          undefined,
          undefined,
          userBadgesDescription,
          undefined,
          embedFields,
          imageEmbed
        ),
      ],
      files: [imageAttachment],
    });
  },
};
