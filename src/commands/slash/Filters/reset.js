            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("reset-filters")
                    .setDescription("reset the filters of the music"),
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
                    const player = client.riffy.players.get(interaction.guild.id);
                    if (!player) return interaction.reply(`I am Not Playing Right Now`);
                    const { channel } = interaction.member.voice;
                    if (!channel) return interaction.reply(`You are not in a voice channel`);
                    if(interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);
                              
                    player.filters.clearFilters();
                    const embed = new EmbedBuilder()
                        .setTitle("🎶 | Reset Filters")
                        .setDescription("🎵 | **Filters has been reseted**")
                        .setColor(client.color)
                        .setTimestamp()
                    return interaction.reply({ embeds: [embed] });
                                   
                }
            };