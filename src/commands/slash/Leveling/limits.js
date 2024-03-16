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
    .setName("level-limits")
    .setDescription("Change the XP icrement limits for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) => 
      option
        .setName("up")
        .setDescription("The maximum XP increment")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000)
    )
    .addIntegerOption((option) => 
      option
        .setName("down")
        .setDescription("The minimum XP increment")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000)
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

    const up = interaction.options.getInteger("up");
    const down = interaction.options.getInteger("down");


    await data.update({ Uplimit: up, LowLimit: down });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Leveling")
          .setDescription(
            `XP Increment limits has been set to ${up} and ${down}`
          )
          .setColor(client.color),
      ],
    });
  },
};
