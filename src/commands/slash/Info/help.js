const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const GuildSchema = require('../../../handlers/xata').getXataClient().db.GuildSchema;
const axios = require('axios');
const { menuPages } = require("simply-djs")
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View all the possible commands!'),
    options: {
        cooldown: 15000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

 
        const commands = await fetchCommands();
        const Schema = await GuildSchema.read(`${interaction.guildId}`);
        if (!Schema || !Schema.prefix) { prefix = config.handler.prefix } else prefix = Schema.prefix;
        const home = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setColor(client.color)
            .setTimestamp()
            .setImage("https://cdn.discordapp.com/attachments/1052282755821621248/1193642128010641480/Picsart_24-01-07_23-36-28-653.jpg")
            .setDescription(`[Aayu](https://s.aayubot.me/invite) - Your new anime bestie! 💕
            Hello ${interaction.user}! I am a Multipurpose Bot That Works On Prefix and Slash Commands Both. You Can Se My Categories Below.
            
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
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
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

           await menuPages(interaction,  {
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
                    label: "Delete interaction",
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

