            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
                                                                             
            const Track = require("../../../handlers/xata").getXataClient().db.Track;
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("leave")
                    .setDescription("make me leave a voice channel"),
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
                    if(interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`); 
                    const player = client.riffy.players.get(interaction.guild.id);
                    if(!player) return interaction.reply(`I am not in a voice channel`);
if (player.current){
                    const Mdata = await Track.filter({
                        Guild: interaction.guild.id,
                        Track: player.current.info.identifier
                    }).getFirst();
                
                    if(Mdata)  {
                        const ch =  client.channels.cache.get(Mdata.Channel)
                        if(ch) {
                            await ch.messages.fetch(Mdata.Message).then(async (msg) => {
                                await msg.delete();
                    
                            await   Mdata.delete();
                            }) .catch(error => {
                                console.error(`Error fetching message: ${error}`);
                            }); 
                        }
                    }
                }


                   
                    await player.destroy();
                    
    
                    const embed = new EmbedBuilder()
                    .setDescription(`\`🚫\` | *Left:* | \`${channel.name}\``)
                        .setColor(client.color);
    
                    return interaction.reply({ embeds: [embed] });
                                   
                }
            };