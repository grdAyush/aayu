            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("clear")
                    .setDescription("clear the queue"),
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
                if (!player) return interaction.reply(`I'm not playing anything right now`);
                const { channel } = interaction.member.voice;
                if (!channel) return interaction.reply(`You are not in a voice channel`);
                if (channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply(`You are not in the same voice channel`);

                player.queue.clear();

                const embed = new EmbedBuilder()
                .setDescription("`📛` | *Queue has been:* `Cleared`")
                .setColor(client.color);

            return interaction.reply({ embeds: [embed] });
                                   
                }
            };