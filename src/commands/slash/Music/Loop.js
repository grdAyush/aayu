            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("loop")
                    .setDescription("set or remove loop from queue or current song")
                    .addStringOption(option => option.setName("type").setDescription("type of loop").setRequired(true).addChoices(
                        {
                            name: "queue",
                            value: "queue"
                        },
                        {
                            name: "current",
                            value: "current"
                        },
                        {
                            name: "none",
                            value: "none"
                        }
                    )),
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
                    if(interaction.guild.members.cache.get(client.user.id).voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);
                    const type = interaction.options.getString("type");
                    if(!type) return interaction.reply("Please Provide a Valid Option\n`queue` or `current` or `none`");
                    if(type == "queue") {
                        player.setLoop("queue");
                        const embed = new EmbedBuilder()
                        .setDescription("`🔁` | *Loop has been set to:* `Queue`")
                        .setColor(client.color);
                        return interaction.reply({ embeds: [embed] });
                    } else if (type == "current") {
                        player.setLoop("current");
                        const embed = new EmbedBuilder()
                        .setDescription("`🔁` | *Loop has been set to:* `Current`")
                        .setColor(client.color);
                        return interaction.reply({ embeds: [embed] });
                    } else {
                        player.setLoop("none");
                        const embed = new EmbedBuilder()
                        .setDescription("`🔁` | *Loop has been set to:* `None`")
                        .setColor(client.color);
                        return interaction.reply({ embeds: [embed] });
                    }
                                   
                }
            };