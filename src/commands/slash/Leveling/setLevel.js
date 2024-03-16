const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const Database = require("../../../handlers/xata").getXataClient().db.Level;
const User = require("../../../handlers/xata").getXataClient().db.UserXP;
module.exports = {
  structure: new SlashCommandBuilder()
    .setName("set-level")
    .setDescription("set level of the user")
    .addUserOption(option => 
         option
            .setName("user")
            .setDescription("The user to set level")
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName("level")
            .setDescription("The level to set")
            .setRequired(true)
            .setMinValue(0)
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
    let user = interaction.options.getUser("user");
    let level = interaction.options.getInteger("level");

    const data2 = await User.filter({
      Guild: interaction.guild.id,
      User: user.id,
    }).getFirst();
    if (!data2)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription("No data found")
            .setColor(client.color),
        ],
      });

    let reqXP = 100;

    for (let i = 1; i <= parseInt(level) - 1; i++)
      reqXP += 5 * (i ^ 2) + 50 * i + 100;
    await data2
      .update({
        Level: parseInt(level),
        XP: reqXP,
      })
      .then(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Leveling")
              .setDescription(
                `Successfully set level of ${user} to ${level}`
              )
              .setColor(client.color),
          ],
        });
      })
      .catch((err) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Leveling")
              .setDescription(`Error: ${err}`)
              .setColor(client.color),
          ],
        });
      });
  },
};
