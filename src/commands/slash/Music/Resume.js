            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("resume")
                    .setDescription("resume the player"),
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
                        
                        const { channel } = interaction.member.voice;
                        if (!channel) return interaction.reply(`You are not in a voice channel`);
                        if(interaction.guild.members.cache.get(client.user.id).voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);
                        const player = client.riffy.players.get(interaction.guild.id);
                        if (!player) return interaction.reply(`I am Not Playing Right Now`);
                
                        if (player.paused) {
                            player.pause(false);
                            const embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription("`⏯` Song Has Been Resumed")
                
                            return interaction.reply({embeds: [embed]});
                        } else {
                            player.pause(true);
                            const embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription("`⏯` Song Has Been Paused")
                
                            return interaction.reply({embeds: [embed]});
                        }
                                   
                }
            };