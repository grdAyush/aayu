            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("remove")
                    .setDescription("remove a song from the queue")
                    .addIntegerOption(option => option.setName("track").setDescription("The track number to remove").setRequired(true)),
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
                    if (interaction.guild.members.cache.get(client.user.id).voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);
                    const player = client.riffy.players.get(interaction.guild.id);
                    if (!player) return interaction.reply(`I am Not Playing Right Now`);
                    const queue = player.queue;
                    if (!queue) return interaction.reply(`There is nothing in the queue`);
            
                    const track = interaction.options.getInteger("track");
                    if (!track) return interaction.reply(`Please Provide a Valid Number`);
                    if (track > queue.length) return interaction.reply(`Please Provide a Valid Number`);
            
                    const embed = new EmbedBuilder()
                        .setTitle(`Removed Song`)
                        .setDescription(`**Removed ${queue[track - 1].info.title} From The Queue**`)
                        .setColor(client.color)
                        .setTimestamp();
                        player.queue.remove(track - 1);
                        interaction.reply({embeds: [embed]});
                                   
                }
            };