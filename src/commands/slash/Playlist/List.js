            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Playlist = require("../../../handlers/xata").getXataClient().db.Playlist;
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("playlists")
                    .setDescription("view your playlists"),
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
                        owner: interaction.user.id
                    }).getMany();

                    if(!playlist.length) return interaction.editReply({content: "You dont have any playlists", ephemeral: true});
                    const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
                    .setDescription(playlist.map((pl, i) => `\`${i + 1}\` - ${pl.name}`).join("\n"));
                    interaction.editReply({embeds: [embed]});
                                   
                }
            };