const { ChannelType, Message, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");
const { getXataClient } = require("../../handlers/xata")
const xata = getXataClient();
const NoPrefix = xata.db.NoPrefix;


const cooldown = new Map();

module.exports = {
  event: "messageCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    if (!config.handler.commands.prefix) return;

    let prefix = config.handler.prefix;

  
      try {
        const guildData = await xata.db.GuildSchema.read(`${message.guild.id}`)

        if (guildData && guildData?.prefix) prefix = guildData.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    
if(message.content === `<@${client.user.id}>`) {

  message.reply({

    embeds: [
      new EmbedBuilder()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Aayu swoops into the chat, riding a wave of excitement. 😊

      > Hey ${message.author}! It's Aayu, your anime buddy, here to sprinkle some magic! ✨
      
      > Don't **Know The Prefix**: \`${prefix}\`
      > Don't Know Where To Start \`${prefix}help\`!
      > Is Aayu Not Responding? \`${prefix}ping\``)
.setImage("https://cdn.discordapp.com/attachments/1188788884746817566/1189509590304440320/20231227_153616.jpg")
.setFooter({ text: `${client.user.username} By ${client.users.cache.get("1051806381461745664").username}`, iconURL: `${client.users.cache.get("1051806381461745664").displayAvatarURL()}` })
    ], 
    components: [
      new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite Me")
        .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
        .setEmoji("<:a_inv:1189528187110178896>"),

        new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Support Server")
        .setURL("https://s.aayubot.me/support")
        .setEmoji("<:a_sup:1189529332683640832>"),
        )
    ]
})
}
const data = await NoPrefix.read(`Aayu`);
    if (message.content.startsWith(prefix) || data.Users.includes(message.author.id)) {

      let args;
      if (data.Users.includes(message.author.id)) {
        args = message.content.slice(0).trim().split(/ +/g);
      } else 
    { args = message.content.slice(prefix.length).trim().split(/ +/g);}
    const commandInput = args.shift().toLowerCase();

    if (!commandInput.length) return;

    let command =
      client.collection.prefixcommands.get(commandInput) ||
      client.collection.prefixcommands.get(
        client.collection.aliases.get(commandInput)
      );

    if (command) {
      try {
        if (
          command.structure?.permissions &&
          !message.member.permissions.has(command.structure?.permissions)
        ) {
          await message.reply({
            content:
              config.messageSettings.notHasPermissionMessage !== undefined &&
              config.messageSettings.notHasPermissionMessage !== null &&
              config.messageSettings.notHasPermissionMessage !== ""
                ? `${config.messageSettings.notHasPermissionMessage}\nYou Need Following Permission(s)\n${command.structure?.permissions.join(" ")}`
                : "You do not have the permission to use this command.",
          });

          return;
        }

        if (command.structure?.developers) {
          if (!config.users.developers.includes(message.author.id)) {
            setTimeout(async () => {
              await message.reply({
                content:
                  config.messageSettings.developerMessage !== undefined &&
                  config.messageSettings.developerMessage !== null &&
                  config.messageSettings.developerMessage !== ""
                    ? config.messageSettings.developerMessage
                    : "You are not authorized to use this command",
              });
            }, 5 * 1000);
          }

          return;
        }

        if (command.structure?.nsfw && !message.channel.nsfw) {
          await message.reply({
            content:
              config.messageSettings.nsfwMessage !== undefined &&
              config.messageSettings.nsfwMessage !== null &&
              config.messageSettings.nsfwMessage !== ""
                ? config.messageSettings.nsfwMessage
                : "The current channel is not a NSFW channel.",
          });

          return;
        }

        if (command.structure?.cooldown) {
          const cooldownFunction = () => {
            let data = cooldown.get(message.author.id);

            data.push(commandInput);

            cooldown.set(message.author.id, data);

            setTimeout(() => {
              let data = cooldown.get(message.author.id);

              data = data.filter((v) => v !== commandInput);

              if (data.length <= 0) {
                cooldown.delete(message.author.id);
              } else {
                cooldown.set(message.author.id, data);
              }
            }, command.structure?.cooldown);
          };

          if (cooldown.has(message.author.id)) {
            let data = cooldown.get(message.author.id);

            if (data.some((v) => v === commandInput)) {
              await message.reply({
                content:
                  config.messageSettings.cooldownMessage !== undefined &&
                  config.messageSettings.cooldownMessage !== null &&
                  config.messageSettings.cooldownMessage !== ""
                    ? config.messageSettings.cooldownMessage
                    : "Slow down buddy! You're too fast to use this command.",
              });

              return;
            } else {
              cooldownFunction();
            }
          } else {
            cooldown.set(message.author.id, [commandInput]);

            cooldownFunction();
          }
        }

        command.run(client, message, args);
      } catch (error) {
        log(error, "err");
      }
    }}
  },
};
