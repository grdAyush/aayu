            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const GuildSchema = require("../../../schemas/GuildSchema")
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("stop")
                    .setDescription("stop the music"),
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
                    if (!player) return interaction.reply(`Song are not playing!`);
                    const { channel } = interaction.member.voice;
                    if (!channel) return interaction.reply(`You are not in a voice channel`);
                    if(interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) return interaction.reply(`You are not in the same voice channel as me!`);

                    const Data = await GuildSchema.findOne({ guild: interaction.guild.id })

                    if(!Data || Data.TwentyFourSeven == false ){

                        player.queue.clear();
                        player.stop();
                        player.destroy();

                        const embed = new EmbedBuilder()
                        .setDescription("`📻` | *Music has been:* `Stopped`")
                        .setColor(client.color);

                        interaction.reply({ embeds: [embed] })

                    } else if(Data.TwentyFourSeven == true) {
                        player.destroy();

                        const embed = new EmbedBuilder()
                        .setDescription("`📻` | *Music has been:* `Stopped`\n But I have seen That You Have Enabled `24/7` Mode Do You Want Me To Rejoin The Channel")
                        .setColor(client.color);
                        
                        const buttons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Danger)
                        )

                         interaction.reply({ embeds: [embed], components: [buttons] })

                            const filter = i => i.user.id === interaction.user.id;
                            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                            collector.on("collect", async i => {
                                if(i.customId === "yes"){
                                    const {channel} = i.member.voice;
                                    if(!channel) return i.reply({ content: `I Think You Leaved The Voice Channel\n\nNo Worries use \`join\` command to rejoin`, ephemeral: true });
                                    const player = await client.riffy.createConnection({
                                        guildId: i.guild.id,
                                        voiceChannel: channel.id,
                                        textChannel: i.channel.id,
                                        deaf: true,
                                    });

                                 
                                    i.reply(`I have rejoined the channel!`)

                                    i.message.delete();
                                } else if(i.customId === "no"){
                                    i.reply(`Ok I will not rejoin the channel!`)
                                    i.message.delete();
                                }
                            })
                        

                    

                    }

                                   
                }
            };