const { Message, PermissionFlagBits, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const Database = require("../../../handlers/xata").getXataClient().db.Level;
module.exports = {
  structure: {
    name: "level-ignore-channel",
    description: "add or remove a ignore channel from leveling system",
    aliases: ["l-ignore-channel", "lignore-channel", "levelignore-channel"],
    permissions: ["Administrator"],
    cooldown: 7000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message} message
   * @param {[String]} args
   */
  run: async (client, message, args) => {
    const data = await Database.read(`${message.guild.id}`);

    if (!data || data.Toggle === false || !data.Toggle)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Bruh! Leveling System is not enabled")
            .setColor(client.color),
        ],
      });

    const channel = message.mentions.channels.first()
      ? message.mentions.channels.first()
      : message.guild.channels.cache.get(args[1]);

    const type = args[0];
    if (!args[0] || args[0] !== "add" && args[0] !== "remove")
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(
              "Please provide a valid type\n\n**Example:**\n```level-ignore-channel add #channel```"
            )
            .setColor(client.color),
        ],
      });
    if (!channel)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Please provide a valid channel")
            .setColor(client.color),
        ],
      });
      if(channel.type !== 0 && channel.type !== 5) return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Please provide a valid channel Type. It Should Be Guild Text Channel Only")
            .setColor(client.color),
        ],
      });

    if (type === "add") {
      if (data.IgnoreXP.includes(channel.id))
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Leveling")
              .setDescription("This channel is already ignored")
              .setColor(client.color),
          ],
        });
      await data.update({ IgnoreXP: [...data.IgnoreXP, channel.id] });
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(`Channel ${channel} has been ignored`)
            .setColor(client.color),
        ],
      });
    } else if (type === "remove") {
      if (!data.IgnoreXP.includes(channel.id))
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Leveling")
              .setDescription(
                "This channel is not added to  ignore xp channels so it can't be removed from it"
              )
              .setColor(client.color),
          ],
        });
      await data.update({
        IgnoreXP: data.IgnoreXP.filter((ch) => ch !== channel.id),
      });
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(
              `Channel ${channel} has been removed from ignored channels`
            )
            .setColor(client.color),
        ],
      });
    }
  },
};
