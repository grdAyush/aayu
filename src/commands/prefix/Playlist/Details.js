const { Message, PermissionFlagBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;
module.exports = {
    structure: {
        name: 'playlist-details',
        description: 'see the songs in your playlist or a public playlist',
       aliases: ["pl-details", "playlist-details", "pllist-details", "pllists-details", "playlist-list-details", "playlist-lists-details"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        if (!args) return message.reply("Please provide a playlist name");
        const lmsg = await message.reply({
            components: [client.load],
        });

        const playlistName = args.join(" ");
        let playlist = await Playlist.filter({
            name: playlistName,
            owner: message.author.id
        }).getFirst();

        if (!playlist) {
            playlist = await Playlist.filter({
                name: playlistName,
                Private: false
            }).getFirst();
        }

        if (!playlist) {
            return (await lmsg).edit({
                components: [],
                content: "I could not find that playlist in your playlist list or in public playlists."
            });
        }

        const songsPerPage = 10;
        const totalSongs = playlist.tracks.length;

        
        const totalPages = Math.ceil(totalSongs / songsPerPage);

      
        let currentPage = 1;

        
        await displayPage(currentPage);

       
        async function displayPage(page) {
            const startIndex = (page - 1) * songsPerPage;
            const endIndex = startIndex + songsPerPage;

            const pageSongs = playlist.tracks.slice(startIndex, endIndex);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Playlist: ${playlist.name} - Page ${page}/${totalPages}`)
                .setDescription(pageSongs.join("\n"))
                .setTimestamp()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });

            const components = [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("prevPage")
                             .setEmoji("<:previous:1121646915726086225>")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(page === 1),
                        new ButtonBuilder()
                            .setCustomId("nextPage")
                           .setEmoji("<:next:1121646775770558494>")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(page === totalPages)
                    )
            ];

            (await lmsg).edit({ embeds: [embed], components: components });
        }

        
        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector =  lmsg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async (interaction) => {
            interaction.deferUpdate();

            if (interaction.customId === "prevPage" && currentPage > 1) {
                currentPage--;
                await displayPage(currentPage);
            } else if (interaction.customId === "nextPage" && currentPage < totalPages) {
                currentPage++;
                await displayPage(currentPage);
            }
        });

        collector.on("end", async () => {
            
            (await lmsg).edit({ components: [] });
        });
      
                                         
    }
};