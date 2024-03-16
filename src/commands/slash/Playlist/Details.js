            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;                                                          
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlist-details")
                    .setDescription("see the songs of your or any public playlist")
                    .addStringOption(option => option.setName("playlist-name").setDescription("the name of the playlist you want to see").setRequired(true)),
               options: {
                    nsfw: false,
                    developers: false,
cooldown: 5000
                },
               /**
                 * @param {ExtendedClient} client
                * @param {ChatInputCommandInteraction} interaction
                */
                run: async (client, interaction) => {
                 let msg =   interaction.reply({ components: [client.load]})

                    const playlistName = interaction.options.getString("playlist-name");

                    let playlist = await Playlist.filter({
                        name: playlistName,
                        owner: interaction.user.id
                    }).getFirst();

                    if (!playlist) {
                        playlist = await Playlist.filter({
                            name: playlistName,
                            Private: false
                        }).getFirst();
                    }

                    if (!playlist) {
                        return interaction.editReply({
                            content: "I could not find that playlist in your playlist list or in public playlists.",
                            components: []
                        });
                    }

                    const songsPerPage = 5;
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
                            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
            
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
            
                        await interaction.editReply({ embeds: [embed], components: components });
                    }
            
                    
                    const filter = (i) => i.user.id === interaction.user.id;
                    const collector = (await msg).createMessageComponentCollector({ filter, time: 60000 });
            
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
                        
                        interaction.editReply({ components: [] });
                    });
                  

                                   
                }
            };