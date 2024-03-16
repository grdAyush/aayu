            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Invites = require('../../../handlers/xata').getXataClient().db.Invites;                                                
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("invites")
                    .setDescription("check your own or others invites")
                    .addUserOption(
                        option =>
                        option.setName("user")
                        .setDescription("the user you want to check")
                        .setRequired(false)

                    ),
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
                    const user = interaction.options.getUser("user") || interaction.user;
                    const Data = await Invites.filter({ Guild: interaction.guild.id, Inviter: user.id }).getFirst();
                    if(!Data) return interaction.reply("This user doesn't have any invites")
                    const Embed = new EmbedBuilder()
                    .setTitle(`${client.emoji.invites} Invite Tracker`)
                      .setDescription(
                        `**${user.displayName} Have ${Data.Invites} invites\n\nJoins: ${Data.Joins}\nLeft: ${Data.Left}\nFake: ${Data.Fake}\nRejoin: ${Data.Rejoin}**`
                      )
                      .setColor(client.color)
                      .setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`)
                      .setFooter({
                        text: `Requested by ${interaction.user.displayName}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                      });

                    return interaction.reply({ embeds: [Embed] })
                }
            };