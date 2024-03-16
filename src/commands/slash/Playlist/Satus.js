            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Playlist = require('../../../handlers/xata').getXataClient().db.Playlist;                                                          
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlist-satus")
                    .setDescription("change the status of the playlist (Public or Private)")
                    .addStringOption(option => 
                        option.setName("playlist").setDescription("Name of the playlist ").setRequired(true)),
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
                    const Pname = interaction.options.getString("playlist");
                    const playlist = await Playlist.filter({
                        name: Pname,
                        owner: interaction.user.id
                    }).getFirst();
            
                    if(!playlist) return interaction.editReply({ content: "I Think That Playlist not exist or not belongs to you"})
            
                    const status = playlist.Private;
            
                    if(status) {
                        await playlist.update({
                            Private: false
                        })
            
                        interaction.editReply({ content: "Successfully Made Your Playlist Public"})
                    }
                     else {
                        await playlist.update({
                            Private: true
                        })
            
                        interaction.editReply({
                            content: " Successfully Privatised The Playlist"
                        })
                     }
                                   
                }
            };