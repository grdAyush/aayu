const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const Database = require("../../../handlers/xata").getXataClient().db.Level;
module.exports = {
  structure: new SlashCommandBuilder()
    .setName("level-rate")
    .setDescription("Change the XP rate of your server. (in percentage)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) => 
        option.setName("rate").setDescription("The Percentage Of the Xp rate").setRequired(true)
        .setMinValue(1).setMaxValue(1000)
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

    const rate = interaction.options.getInteger("rate");

    await data.update({ XPRate: rate / 100 });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Leveling")
          .setDescription(`XP Rate has been set to ${rate}%`)
          .setColor(client.color),
      ],
    });
  },
};
