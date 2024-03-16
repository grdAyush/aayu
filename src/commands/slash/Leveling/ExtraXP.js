const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const Database = require("../../../handlers/xata").getXataClient().db.Level;

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("level-extraxp-channel")
    .setDescription("add or remove a extraxp channel from leveling system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
      option
        .setName("channel")
        .setDescription("The channel to add or remove")
        .setRequired(true)
       .addChannelTypes(0,5)
    )
    .addStringOption(option => 
      option
        .setName("type")
        .setDescription("The type of the channel (to add or remove)")
        .setRequired(true)
        .addChoices(
          {
            name: "add",
            value: "add",
          },
          {
            name: "remove",
            value: "remove",
          }
        )
        ),
  options: {
    nsfw: false,
    developers: false,
    cooldown: 5000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const data = await Database.read(`${interaction.guild.id}`);

    if (!data || data.Toggle === false || !data.Toggle)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("Bruh! Leveling System is not enabled")
            .setColor(client.color),
        ],
      });

    const channel = interaction.options.getChannel("channel");
    const type = interaction.options.getString("type");
    if (type === "add") {
      if (data.ExtraXP.includes(channel.id))
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Leveling")
              .setDescription("This channel is already ExtraXP")
              .setColor(client.color),
          ],
        });

      await data.update({
        ExtraXP: [...data.ExtraXP, channel.id],
      });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(
              `The channel ${channel} has been added to the extraxp list`
            )
            .setColor(client.color),
        ],
      });
    } else if (type === "remove") {
      if (!data.ExtraXP.includes(channel.id))
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Leveling")
              .setDescription("This channel is not extraxp")
              .setColor(client.color),
          ],
        });

      await data.update({
        ExtraXP: data.ExtraXP.filter((x) => x !== channel.id),
      });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(
              `The channel ${channel} has been removed from the extraxp list`
            )
            .setColor(client.color),
        ],
      });
    }
  },
};
