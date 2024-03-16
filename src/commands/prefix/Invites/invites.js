const { Message, PermissionFlagBits, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const Invites = require("../../../handlers/xata").getXataClient().db.Invites;
module.exports = {
  structure: {
    name: "invites",
    description: "show the invites of the user",
    aliases: ["i"],
    permissions: null,
    cooldown: 7000,
    category: "Invites",
  },

  /**
   * @param {ExtendedClient} client
   * @param {Message} message
   * @param {[String]} args
   */
  run: async (client, message, args) => {
    let user;
    if (!args[0] && !message.mentions.users.first()) {
      user = message.author;
    } else if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else if (args[0]) {
      user = message.guild.members.cache.get(args[0]);
      if (!user) {
        user = message.guild.members.cache.get(args[0]);
        if (!user) {
          return message.reply(`User not found`);
        }
      }
    }

    let Data = await Invites.filter({
      Guild: message.guildId,
      Inviter: user.id,
    }).getFirst();
    if (!Data) {
      message.reply(`User does not have any invites`);
    }

    const Embed = new EmbedBuilder()
    .setTitle(`${client.emoji.invites} Invite Tracker`)
      .setDescription(
        `**${user.displayName} Have ${Data.Invites} invites\n\nJoins: ${Data.Joins}\nLeft: ${Data.Left}\nFake: ${Data.Fake}\nRejoin: ${Data.Rejoin}**`
      )
      .setColor(client.color)
      .setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`)
      .setFooter({
        text: `Requested by ${message.author.displayName}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    await message.reply({ embeds: [Embed] });
  },
};
