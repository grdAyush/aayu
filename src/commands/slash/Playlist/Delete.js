            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;                                                                 
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlist-delete")
                    .setDescription("delete the playlist")
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

                    const playlist = await Playlist.filter({
                        name: interaction.options.getString("playlist"),
                        owner: interaction.user.id
                    }).getFirst();

                    if(!playlist) return interaction.editReply("Could not find that playlist");

                    await playlist.delete();

                    interaction.editReply("Deleted playlist")
                                   
                }
            };