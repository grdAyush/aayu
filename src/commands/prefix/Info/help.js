const { Message, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const GuildSchema = require('../../../handlers/xata').getXataClient().db.GuildSchema;
const { menuPages } = require("simply-djs")
const axios = require('axios');

module.exports = {
    structure: {
        name: 'help',
        description: 'View all the possible commands!',
        aliases: ['h'],
        cooldown: 15000,
        category: "Info"
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {

        const commands = await fetchCommands();
        const Schema = await GuildSchema.read(`${message.guildId}`);
        if (!Schema || !Schema.prefix) { prefix = config.handler.prefix } else prefix = Schema.prefix;
        const home = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
            .setColor(client.color)
            .setTimestamp()
            .setImage("https://cdn.discordapp.com/attachments/1052282755821621248/1193642128010641480/Picsart_24-01-07_23-36-28-653.jpg")
            .setDescription(`[Aayu](https://s.aayubot.me/invite) - Your new anime bestie! 💕
            Hello ${message.user}! I am a Multipurpose Bot That Works On Prefix and Slash Commands Both. You Can Se My Categories Below.
            
> Want To Know **Prefix:** \`${prefix}\`
            
            
**Command Categories**
> ${client.emoji.music} Music
> ${client.emoji.info} Info
> ${client.emoji.filters} Filter
> ${client.emoji.setup} Setup
> ${client.emoji.playlist} Playlists
> ${client.emoji.invites} Invite Tracking
> ${client.emoji.level} Leveling

[Commands](https://aayubot.me/commands//) | [Support Server](https://s.aayubot.me/support/) | [Invite](https://s.aayubot.me/invite/)
`).setThumbnail(client.user.displayAvatarURL()).setFooter({ text: `${client.user.username} 💕 By ${client.users.cache.get("1051806381461745664").username}`, iconURL: `${client.users.cache.get("1051806381461745664").displayAvatarURL()}` })

    


        function createGroupEmbed(group, commands, Title) {
    const groupCommands = commands.filter(command => command.group === group);      
    const embed = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
      .setColor(client.color)
         .setTimestamp()
         //.setImage("https://cdn.discordapp.com/attachments/1052282755821621248/1193642128010641480/Picsart_24-01-07_23-36-28-653.jpg")
         .setTitle(`${Title} Commands`)
         .setDescription(groupCommands.map(cmd => `\`${cmd.name}\``).join(', '))

            return embed;
          }


          const music = createGroupEmbed('music', commands, 'Music');
            const info = createGroupEmbed('info', commands, 'Info');
            const filters = createGroupEmbed('filters', commands, 'Filters');
            const setup = createGroupEmbed('setup', commands, 'Setup');
            const playlists = createGroupEmbed('playlist', commands, 'Playlists');
            const invites = createGroupEmbed('invites', commands, 'Invite Tracker');
            const level = createGroupEmbed('leveling', commands, 'Leveling');

           await menuPages(message,  {
                strict: true,
                type: "Send",
                placeHolder: "Click Me To See Commands 💕",
                embed: home,
                data: [
                    { label: "Music", emoji: `${client.emoji.music}`, embed: music },
                    { label: "Info", emoji: `${client.emoji.info}`, embed: info },
                    { label: "Filters", emoji: `${client.emoji.filters}`, embed: filters },
                    { label: "Setup", emoji:`${client.emoji.setup}`, embed: setup },
                    { label: "Playlists", emoji: `${client.emoji.playlist}`, embed: playlists },
                    { label: "Invite Tracker", emoji: `${client.emoji.invites}`, embed: invites },
                    { label: "Leveling", emoji: `${client.emoji.level}`, embed: level },
                ],
                delete: {
                    enable: false,
                    label: "Delete message",
                    description: "Delete the menu pagination"
                  }

            })

            


    }
};



const commandsUrl = 'https://www.aayubot.me/commands.json';
async function fetchCommands() {
  try {
    const response = await axios.get(commandsUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching commands:', error);
    return null;
  }
}

