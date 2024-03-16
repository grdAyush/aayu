            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Invites = require('../../../handlers/xata').getXataClient().db.Invites;
            const InviteBy = require("../../../handlers/xata").getXataClient().db.InviteBy;
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("reset-invites")
                    .setDescription("reset the user's or all invites")
                    .addStringOption(option => option.setName("option").setDescription("Please provide a valid option").setRequired(true).addChoices(
                        {
                            name: "User",
                            value: "user"
                        },
                        {
                            name: "All",
                            value: "all"
                        }
                    ))
                    .addUserOption(option => option.setName("user").setDescription("Please provide a user if option is selected to user").setRequired(false))
                    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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

                    const bruh = await Invites.filter({ Guild: interaction.guildId }).getMany();
                    const bruh2 = await InviteBy.filter({ Guild: interaction.guildId }).getMany();


                    interaction.deferReply();

                    const option = interaction.options.getString("option");
                    if (option === "user") {
                        const user = interaction.options.getUser("user");
                        if(!user) return interaction.followUp("Please Provide a User");
                        let  Data = await Invites.filter({ Guild: interaction.guildId, Inviter: user.id  }).getFirst();
                        let Data2 = await InviteBy.filter({ Guild: interaction.guildId, Inviter: user.id }).getMany();
                        if(!Data) {
                            interaction.followUp("User does not have any invites");
                        };
                        if(Data2) {
                            
                            for( const i of Data2) {
                                i.delete();    
                                }
                        }
                        Data.update({ Invites: 0, Rejoin: 0, Left: 0, Fake: 0 });
                        interaction.followUp(`Successfully resetted ${user.username}'s invites`);
                    } else {
                        const embed =  new EmbedBuilder()
                        .setTitle('Command: Reset Invites')
                        .setDescription(`Are You Sure You Want To Reset All Invites?`)
                        .setColor(client.color)
                        .setTimestamp()
                       // .setFooter(`Requested By ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("yes")
                            .setLabel("Yes")
                            .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                            .setCustomId("no")
                            .setLabel("No")
                            .setStyle(ButtonStyle.Danger)
                        )
                        const msg = await interaction.followUp({ embeds: [embed], components: [row] });
                        const filter = i => i.user.id === interaction.user.id;
                        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
                        collector.on("collect", async (i) => {
                            if (i.customId === "yes") {
                            if(!bruh) return interaction.followUp("No Guild Data Found");
                            for ( const i of bruh ) {
                                i.delete();
                            }
                            if(bruh2) {
                                for ( const i of bruh2 ) {
                                    i.delete();
                                }
                            } 
                                await interaction.followUp("Successfully resetted all invites");
                              
                            } else {
                                await interaction.followUp("Cancelled");
                                await msg.delete();
                            }
                        })

                    }
                                   
                }
            };