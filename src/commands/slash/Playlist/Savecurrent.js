            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;                                                                    
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("savecurrent")
                    .setDescription("save the current playing song to the playlist")
                    .addStringOption(option => option.setName("playlist").setDescription("The playlist name").setRequired(true)),
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
                    const player = client.riffy.players.get(interaction.guildId)
                    if(!player) return interaction.editReply({
                        content: "I am not playing anything"
                    })
                    const current = player.current;

                    if(!current) return interaction.editReply({
                        content: "I am not playing anything"
                    })


                    const playlist = await Playlist.filter({
                        owner: interaction.user.id,
                        name: interaction.options.getString("playlist")
                    }).getFirst();

                    if(!playlist) return interaction.editReply({
                        content: "No Playlist Found with that name"
                    })

                    const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setColor(client.color)
                    .setTimestamp()
                    .setDescription(`**[${current.info.title}](${current.info.uri})** Has Been Added To **${playlist.name}** Playlist`)

                             
                    await playlist.update({
                        tracks: [...playlist.tracks, `${current.info.title} By ${current.info.author} `]
                    })

                    interaction.editReply({
                        embeds: [embed]
                    })
                }
            };