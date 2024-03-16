        const { Message, PermissionFlagBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
module.exports = {
    structure: {
        name: 'invite',
        description: 'invite Aayu to your server ',
       aliases: [],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        const Buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Invite me!')
                    .setURL(`https://s.aayubot.me/invite`),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Support server')
                    .setURL(`https://s.aayubot.me/support`)
                    
            );

            const embed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
            .setColor(client.color)
            .setFooter({ text: `Aayu 💕 By ${client.users.cache.get("1051806381461745664").username}`, iconURL: `${client.users.cache.get("1051806381461745664").displayAvatarURL()}` })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`> Aayu, a multipurpose Discord bot, brings anime magic to your server with dynamic playlists, detailed stats, and nonstop anime jams. Add Aayu for an epic experience!`)
                         
            message.reply({
                embeds: [embed],
                components: [Buttons]
            })
    }
};