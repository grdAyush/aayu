const { Message, PermissionFlagBits, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const Database = require("../../../handlers/xata").getXataClient().db.Level;
module.exports = {
  structure: {
    name: "level-rewards",
    description: "Add  or Remove a level reward for your server",
    aliases: ["lr", "l-rewards", "levelrewards"],
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

    const type = args[0];
    if (!args[0] || args[0] !== "add" && args[0] !== "remove")
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(
              "Please provide a valid type\n\n**Example:**\n```level-rewards add 10 @role``` 0"
            )
            .setColor(client.color),
        ],
      });

    let level = args[1];
    if (!level || isNaN(level))
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(
              "Please provide a valid level\n\n**Example:**\n```level-rewards add 10 @role``` 1 "
            )
            .setColor(client.color),
        ],
      });

    const role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.cache.get(args[2]);
    if (!role && type === "add")
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Leveling")
            .setDescription(
              "Please provide a valid role\n\n**Example:**\n```level-rewards add 10 @role``` 2"
            )
            .setColor(client.color),
        ],
      });
      
    if (type === "add") {
        level = `${level}`;

        const check = data.LevelRewards[level];
        if (check)
          return message.reply({
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

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Leveling")
                .setDescription(
                    `Level ${level} is added to the rewards list`
                )
                .setColor(client.color),
            ],
            });

    } else if (type === "remove") {
        level = `${level}`;

        const check = data.LevelRewards[level];
        if (!check)
          return message.reply({
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

        return message.reply({
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
