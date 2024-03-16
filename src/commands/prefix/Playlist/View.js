const { Message, PermissionFlagBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;

module.exports = {
    structure: {
        name: 'playlists-view',
        description: 'View all public playlists',
        aliases: ["pl-view", "playlist-view", "pllist-view", "pllists-view", "playlist-list-view", "playlist-lists-view"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        const lmsg = message.reply({
            components: [
                client.load
            ]
        })
        const playlist = await Playlist.filter({
            Private: false
        }).getAll();
    
        if (!playlist.length) return (await lmsg).edit({ content: "There are no public playlists", components: [] });
    
        const pageSize = 7;
        let currentPage = 0;
    
        const generateEmbed = () => {
            const start = currentPage * pageSize;
            const end = start + pageSize;
            const currentPlaylists = playlist.slice(start, end);
    
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTitle(`Public Playlists`)
                .setFooter({ text: `Page ${currentPage + 1}/${Math.ceil(playlist.length / pageSize)}`})
                .setDescription(currentPlaylists.map((pl, i) => `\`${start + i + 1}\`. - ${pl.name}`).join("\n"));
    
            return embed;
        };
    
        const updateMessage = async () => {
            const embed = generateEmbed();
            await msg.edit({ embeds: [embed] });
        };
    
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('left')
                .setEmoji('<:previous:1121646915726086225>')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('right')
                .setEmoji('<:next:1121646775770558494>')
                .setStyle(ButtonStyle.Secondary),
        );
    
        const embed = generateEmbed();
        const msg = (await lmsg).edit({ embeds: [embed], components: [row] });
    
        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
    
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "right") {
                if (currentPage < Math.ceil(playlist.length / pageSize) - 1) {
                    currentPage++;
                    await updateMessage();
                }
            } else if (interaction.customId === "left") {
                if (currentPage > 0) {
                    currentPage--;
                    await updateMessage();
                }
            }
    
            await interaction.deferUpdate();
        });
    }
};