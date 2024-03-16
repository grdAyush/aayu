            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
           const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;                                                               
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlists-view")
                    .setDescription("View All The Public Playlists"),
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
                    interaction.deferReply();
                    const playlist = await Playlist.filter({
                        Private: false
                    }).getAll();
                
                    if (!playlist.length) return interaction.editReply({ content: "There are no public playlists" });
                
                    const pageSize = 7;
                    let currentPage = 0;
                
                    const generateEmbed = () => {
                        const start = currentPage * pageSize;
                        const end = start + pageSize;
                        const currentPlaylists = playlist.slice(start, end);
                
                        const embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                            .setTitle(`Public Playlists - Page ${currentPage + 1}/${Math.ceil(playlist.length / pageSize)}`)
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
                    const msg = await interaction.editReply({ embeds: [embed], components: [row] });
                
                    const filter = (interaction) => interaction.user.id === interaction.user.id;
                
                    const collector =  msg.createMessageComponentCollector({ filter, time: 60000 });
                
                    collector.on('collect', async (i) => {
                        if (i.customId === 'left') {
                            if (currentPage !== 0) {
                                currentPage--;
                                await updateMessage();
                            }
                        } else if (i.customId === 'right') {
                            if (currentPage < playlist.length / pageSize - 1) {
                                currentPage++;
                                await updateMessage();
                            }
                        }
                        await i.deferUpdate();
                    });
                
                    collector.on('end', async () => {
                        const embed = generateEmbed();
                        await msg.edit({ embeds: [embed], components: [] });
                    });
                                   
                }
            };