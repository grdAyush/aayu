            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder,
                EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");

            const FormatDuration = require("../../../../structures/FormatDuration");
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("seek")
                    .setDescription("seek the music to a certain time")
                    .addNumberOption(option => option.setName("time").setDescription("The time to seek to").setRequired(true).setMinValue(1)),
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
                    const value = interaction.options.getNumber("time");
                    const { channel } = interaction.member.voice;
                    const player = client.riffy.players.get(interaction.guildId);
                    if(!player) return interaction.editReply({ content: `I am not in a voice channel`, ephemeral: true });
                    if(!channel) return interaction.editReply({ content: `You are not in a voice channel`, ephemeral: true });
                    if(interaction.guild.members.cache.get(client.user.id).voice.channel.id !== interaction.member.voice.channel.id) return interaction.editReply({ content: `You are not in the same voice channel as me!`, ephemeral: true });
                    if(value*1000 >= player.current.info.length || value*1000 <= 0) 
                        return interaction.editReply({ content: `Please provide a valid number`, ephemeral: true });
                    player.seek(value*1000);
                    const Duration = FormatDuration(player.position);

                    const Buttons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId("-10")
                        .setLabel("- 10")
                        .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                        .setCustomId("+10")
                        .setLabel("+10")
                        .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                        .setCustomId("+30")
                        .setLabel("+30")
                        .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                        .setCustomId("-30")
                        .setLabel("-30")
                        .setStyle(ButtonStyle.Secondary)
                    );
                    
                    const embed = new EmbedBuilder()
                        .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
                        .setColor(client.color);
                    const msg = interaction.editReply({ embeds: [embed], components: [Buttons] });
                    const filter = i => i.user.id === interaction.user.id;
                    const collector = await msg.createMessageComponentCollector({ filter, time: 30000 });
                    collector.on("collect", async i => {
                        if(i.customId === "-10") {
                            if(player.position - 10000 <= 0) return;
                            player.seek(player.position - 10000);
                        } else if(i.customId === "+10") {
                            if(player.position + 10000 >= player.current.info.length) return;
                            player.seek(player.position + 10000);
                        } else if(i.customId === "+30") {
                            if(player.position + 30000 >= player.current.info.length) return;
                            player.seek(player.position + 30000);
                        } else if(i.customId === "-30") {
                            if(player.position - 30000 <= 0) return;
                            player.seek(player.position - 30000);
                        }
                        const Duration = FormatDuration(player.position);
                        const embed = new EmbedBuilder()
                            .setDescription(`\`⏮\` | *Seek to:* \`${Duration}\``)
                            .setColor(client.color);
                        i.update({ embeds: [embed] });
                    });

                                   
                }
            };