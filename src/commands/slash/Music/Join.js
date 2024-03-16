            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("join")
                    .setDescription("make me join to a voice channel"),
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
                    const botVoiceChannel = interaction.guild.members.me.voice;
                    if (botVoiceChannel && botVoiceChannel.channel && botVoiceChannel.channel.id) {
                        if (botVoiceChannel.channel.id === interaction.member.voice.channel.id) {
                            return interaction.reply(`I am already in the same voice channel as you!`);
                        } else {
                            return interaction.reply(`I am already in a different voice channel`);
                        }
                    }
                    const player = client.riffy.players.get(interaction.guild.id);
                    if(player) return interaction.reply(`I am already in the voice channel`)  
                    await client.riffy.createConnection({
                        guildId: interaction.guild.id,
                        voiceChannel: interaction.member.voice.channel.id,
                        textChannel: interaction.channel.id,
                        deaf: true
                    });
    
                    const embed = new EmbedBuilder()
                    .setDescription(`\`🔊\` | *Joined:* \`${channel.name}\``)
                    .setColor(client.color);
    
                    return interaction.reply({ embeds: [embed] });
                                   
                }
            };