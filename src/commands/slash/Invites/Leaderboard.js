            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Invites = require('../../../handlers/xata').getXataClient().db.Invites;

           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("invite-leaderboard")
                    .setDescription("shows the guild invite leaderboard "),
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

                    await interaction.deferReply()

                    const invitesData = await Invites.filter({ Guild: interaction.guildId }).sort("Invites", "desc").getAll()
                    if (!invitesData.length) return interaction.reply('No invites found');
                    
                  
                    const pageSize = 7;
                    const pages = Math.ceil(invitesData.length / pageSize);

                    let currentPage = 1;

                    const generateEmbed = (page) => {
                      const embed = new EmbedBuilder()
                      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                          .setTitle('Invite Leaderboard')
                          .setDescription(invitesData.slice((page - 1) * pageSize, page * pageSize).map((data, index) => {
                              let rankEmoji;
                              if (index + 1 === 1) {
                                  rankEmoji = client.emoji.first; 
                              } else if (index + 1 === 2) {
                                  rankEmoji = client.emoji.second; 
                              } else if (index + 1 === 3) {
                                  rankEmoji = client.emoji.third;
                              } else {
                                  rankEmoji = ` \`#${index + 1}\``;
                              }
                              return `${rankEmoji} ${interaction.guild.members.cache.get(data.Inviter)?.user || 'Unknown User'} • **${data.Invites}** Invites (**${data.joins}** Joins | **${data.Rejoin}** Rejoins | **${data.Left}** Left | **${data.Fake}** Fake)`;
                          }).join('\n'))
                          .setColor(client.color)
                          .setFooter({ text: `Page ${page} of ${pages}` });
                  
                      return embed;

                        };
                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setEmoji("<:previous:1121646915726086225>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(currentPage === 1),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setEmoji("<:next:1121646915726086225>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(currentPage === pages),
                        );


                    const messageOptions = {
                        embeds: [generateEmbed(currentPage)],
                        components: [row],
                    };

                    const msg = await interaction.editReply(messageOptions);
                    const filter = (i) => {
                        if (i.user.id !== interaction.user.id) return;
                        return true;
                    };
                    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
                    collector.on('collect', async (i) => {
                        if (i.customId === 'prev') {
                            if (currentPage !== 1) {
                                currentPage--;
                                row.components[0].setDisabled(currentPage === 1);
                                await i.update({ embeds: [generateEmbed(currentPage)], components: [row] });
                            }
                        } else if (i.customId === 'next') {
                            if (currentPage !== pages) {
                                currentPage++;
                                row.components[1].setDisabled(currentPage === pages);
                                await i.update({ embeds: [generateEmbed(currentPage)], components: [row] });
                            }
                        }
                    });
                    collector.on('end', async () => {
                        await msg.edit({ components: [] });
                    });
                    




                                   
                }
            };