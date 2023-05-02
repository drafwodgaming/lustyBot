const {
  SlashCommandBuilder,
  ChannelType,
  userMention,
  inlineCode,
} = require("discord.js");
const moment = require("moment");
const { embedSetup } = require("../functions/embedSetup");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const botColors = require("../../config/botColors.json");
const { serverInfo } = require("../../config/commands.json");
const locales = require("../../config/locales");

module.exports = {
  //#region SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName(serverInfo.name)
    .setDescription(en.commands.serverInfo.description)
    .setDescriptionLocalizations({
      ru: ru.commands.serverInfo.description,
    })
    .setDMPermission(false),
  //#endregion
  async execute(interaction) {
    const { guild, locale } = interaction;
    const {
      createdAt,
      ownerId,
      description,
      memberCount,
      channels,
      emojis,
      roles,
    } = guild;

    moment.updateLocale(locales[locale].time.moment.momentLocale, {
      weekdays: locales[locale].time.moment.momentWeekList.split("_"),
    });
    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: ИНФОРМАЦИЯ О СЕРВЕРЕ
     * ! --------------------------------
     */
    const guildName = guild.name;
    const guildCreatedAt = moment(createdAt).format(
      locales[locale].time.defaultTimeFormat
    );
    const guildDescription = description || "";
    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: ПОЛЬЗОВАТЕЛИ
     * ! --------------------------------
     */
    const guildMembers = guild.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    const botsNumber = guild.members.cache.filter(
      (member) => member.user.bot
    ).size;
    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: КАНАЛЫ
     * ! --------------------------------
     */
    const guildChannels = channels.cache.size;
    const textChannels = channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildText
    ).size;
    const voiceChannels = channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildVoice
    ).size;
    const guildCategories = channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory
    ).size;
    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: ЭМОДЗИ
     * ! --------------------------------
     */
    const emojiCount = emojis.cache.size;
    const emojisAnimate = emojis.cache.filter((emoji) => emoji.animated).size;
    const emojisStatic = emojis.cache.filter((emoji) => !emoji.animated).size;
    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: РОЛИ
     * ! --------------------------------
     */
    const guildRoles = roles.cache
      .map((role) => role.toString())
      .slice(1, 15)
      .join(" ");
    const guildRolesLength = roles.cache.map((role) => role.name).length;
    /**
     * ! --------------------------------
     * ! ПЕРЕМЕННЫЕ: EMBED
     * ! --------------------------------
     */
    const embedTitle = locales[locale].commands.serverInfo.title;
    const embedFields = [
      {
        name: locales[locale].commands.serverInfo.generalLabel,
        value: `${locales[locale].commands.serverInfo.guildName.replace(
          "%guildName",
          guildName
        )}
        ${locales[locale].commands.serverInfo.guildDescription.replace(
          "%guildDescription",
          guildDescription
        )}
        ${locales[locale].commands.serverInfo.owner.replace(
          "%ownerId",
          userMention(ownerId)
        )}
        ${locales[locale].commands.serverInfo.createdAt.replace(
          "%guildCreatedAt",
          inlineCode(guildCreatedAt)
        )}`,
      },
      {
        name: locales[
          locale
        ].commands.serverInfo.totalGuildMembersCount.replace(
          "%memberCount",
          memberCount
        ),
        value: `${locales[locale].commands.serverInfo.guildMembersCount.replace(
          "%guildMembers",
          guildMembers
        )}
        ${locales[locale].commands.serverInfo.guildBotsCount.replace(
          "%botsNumber",
          botsNumber
        )}`,
      },
      {
        name: locales[locale].commands.serverInfo.totalChannelsCount.replace(
          "%guildChannels",
          guildChannels
        ),
        value: `${locales[
          locale
        ].commands.serverInfo.guildTextChannelsCount.replace(
          "%textChannels",
          textChannels
        )}
        ${locales[locale].commands.serverInfo.guildVoiceChannelsCount.replace(
          "%voiceChannels",
          voiceChannels
        )}
        ${locales[locale].commands.serverInfo.guildCategoriesCount.replace(
          "%guildCategories",
          guildCategories
        )}`,
      },
      {
        name: locales[locale].commands.serverInfo.totlaEmojisCount.replace(
          "%emojiCount",
          emojiCount
        ),
        value: `${locales[
          locale
        ].commands.serverInfo.animatedEmojisCount.replace(
          "%emojisAnimate",
          emojisAnimate
        )} 
        ${locales[locale].commands.serverInfo.staticEmojisCount.replace(
          "%emojisStatic",
          emojisStatic
        )}`,
      },
      {
        name: locales[locale].commands.serverInfo.rolesCount.replace(
          "%guildRolesLength",
          guildRolesLength
        ),
        value: guildRoles,
      },
    ];
    const botColor = parseInt(botColors.default);
    const embedThumbnailImage = {
      url: guild.iconURL(),
    };
    await interaction
      .reply({
        embeds: [
          embedSetup(
            botColor,
            embedTitle,
            undefined,
            undefined,
            undefined,
            embedThumbnailImage,
            embedFields
          ),
        ],
      })
      .catch((err) => {
        return interaction.editReply({
          embeds: [
            embedSetup(
              botColor,
              undefined,
              undefined,
              undefined,
              errorCallCommand
            ),
          ],
          ephemeral: true,
        });
      });
  },
};
