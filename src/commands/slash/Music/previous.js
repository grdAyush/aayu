            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("previous")
                    .setDescription("play previous song"),
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

                    interaction.deferReply({ ephemeral: true });
                    const { channel } = interaction.member.voice;
                    if (!channel) return interaction.followUp({ content: `You are not in a voice channel` });

                    const player = client.riffy.players.get(interaction.guild.id);
                    if (!player) return interaction.followUp({ content: `I'm not playing anything` });

                    if(!player.previous) return interaction.followUp({ content: `There is no previous song` });
                    player.queue.unshift(player.previous);
                    player.stop()
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`**Playing** [${player.previous.info.title}](${player.previous.info.uri}) • ${player.previous.info.requester}`)

                    interaction.followUp({ content: " ", embeds: [embed] })
                                   
                }
            };