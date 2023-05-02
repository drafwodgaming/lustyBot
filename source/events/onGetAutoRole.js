const { Events } = require("discord.js");
const autoRoleSchema = require("../models/autoRole");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const { guild, user } = member;
    const interactionAutoRole = await autoRoleSchema.findOne({
      guildId: guild.id,
    });

    if (!interactionAutoRole) return;

    const autoRole = guild.roles.cache.find(
      (role) => role.id === interactionAutoRole.roleId
    );

    if (!autoRole || user.bot) return;

    await member.roles.add(autoRole);
  },
};
