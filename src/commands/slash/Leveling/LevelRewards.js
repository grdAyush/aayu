const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const Database = require("../../../handlers/xata").getXataClient().db.Level;

module.exports = {
  structure: new SlashCommandBuilder().setName("level-rewards")
  .setDescription("Add  or Remove a level reward for your server")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option => option.setName("type").setDescription("Type of the action").setRequired(true)
  .addChoices({
    name: "Add",
    value: "add"
  }, {
    name: "Remove",
    value: "remove"
  })
  )
  .addIntegerOption(option => option.setName("level").setDescription("Level to add or remove").setRequired(true))
  .addRoleOption(option => option.setName("role").setDescription("Role to add or remove").setRequired(false)),
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

    
    if (!data || data.Toggle === false || !data.Toggle) return 
    interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle("Leveling")
        .setDescription("Bruh! Leveling System is not enabled")
        .setColor(client.color)
      ]
    })

    const type = interaction.options.getString("type");
    let level = interaction.options.getInteger("level");
    const role = interaction.options.getRole("role");

    if(type === "add" && !role) return interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle("Leveling")
        .setDescription("Please provide a valid  role to add a level reward")
        .setColor(client.color)
      ]
    })

    if(type === "add") {
        level = `${level}`;

        const check = data.LevelRewards[level];
        if (check)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Leveling")
                .setDescription(
                  `Level ${level} is already added to the rewards list`
                )
                .setColor(client.color),
            ],
          });

          await data.update({ 
            LevelRewards: {
              ...data.LevelRewards,
              [level]: `${role.id}`,
            },
          
          })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Leveling")
                .setDescription(
                    `Level ${level} is added to the rewards list`
                )
                .setColor(client.color),
            ],
            });
    } else if(type === "remove") {

        level = `${level}`;

        const check = data.LevelRewards[level];
        if (!check)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Leveling")
                .setDescription(
                  `Level ${level} is not added to the rewards list`
                )
                .setColor(client.color),
            ],
          });
          delete data.LevelRewards[level];
          await data.update({ 
            LevelRewards: {
              ...data.LevelRewards,
            },
          
          })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Leveling")
                .setDescription(
                    `Level ${level} is removed from the rewards list`
                )
                .setColor(client.color),
            ],
            });

    }
  },
};
