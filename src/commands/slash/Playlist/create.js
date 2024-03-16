const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
                                                                   
const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlist-create")
                    .setDescription("create a playlist").addStringOption( option => option.setName("name").setDescription("name of the playlist").setRequired(true)),
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


                    let PName = interaction.options.getString("name");
                    
                 

                    const playlist = await Playlist.filter({
                        name: PName
                    })
                    .getFirst();

                    if (playlist) return interaction.editReply("Playlist already exists");
                    const Limit = await Playlist.filter({
                        owner: interaction.user.id
                    }).getAll();

                    if(Limit.length >= 5) return interaction.editReply("You can only have 5 playlists");

                    await Playlist.create({
                        name: PName,
                        owner: interaction.user.id,
                        tracks: [],
                        created: Date.now(),
                        Private: true
                    });

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle("Playlist Created")
                            .setDescription(`Successfully created playlist ${PName}`)
                            .setColor(client.color)
                            .setTimestamp()
                        ]
                    })

                    
                                   
                }
            };