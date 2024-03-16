            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
            const Invites = require('../../../handlers/xata').getXataClient().db.Invites;
                                                                             
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("remove-invites")
                    .setDescription("remove invites of the user")
                    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                    .addIntegerOption(option => option.setName("number").setDescription("Please provide a valid number").setRequired(true).setMinValue(1))
                    .addUserOption(option => option.setName("user").setDescription("Please provide a valid user").setRequired(true)),
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
                    const number = interaction.options.getInteger("number");
                    const user = interaction.options.getUser("user");
                    let  Data = await Invites.filter({ Guild: interaction.guildId, Inviter: user.id  }).getFirst();

                    if(!Data) {
                        await Invites.create({
                            Guild: interaction.guildId,
                            Inviter: user.id,
                            Invites: 0,
                        })
                    };

                    if(Data.Invites < number) return interaction.reply('User does not have that many invites');
                    Data.update({ Invites: Data.Invites - number });    
                    interaction.reply(`Successfully removed ${number} invites from ${user.tag}`);

                                   
                }
            };