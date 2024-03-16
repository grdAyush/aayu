            const {
                ChatInputCommandInteraction,
                SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits
            } = require("discord.js");
            const ExtendedClient = require("../../../class/ExtendedClient");
             const Invites = require('../../../handlers/xata').getXataClient().db.Invites;                                                                
           module.exports = {
               structure: new SlashCommandBuilder()
                    .setName("add-invites")
                    .setDescription("Add Invites to a user")
                    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                    .addUserOption(option =>option.setName("user").setDescription("Please provide a user").setRequired(true))
                    .addNumberOption(option =>option.setName("amount").setDescription("Please provide a valid number").setRequired(true).setMinValue(1)),
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


                    const user = interaction.options.getUser("user");
                    const amount = interaction.options.getNumber("amount");
                    let  Data = await Invites.filter({ Guild: interaction.guildId, Inviter: user.id  }).getFirst();

if(!Data) {
   await  Invites.create({
        Guild: interaction.guildId,
        Inviter: user.id,
        Invites: 0,
    })

}

            
         Data.update({ Invites: Data.Invites + amount })
            interaction.reply(`Added ${amount} invites to <@${user.id}>`);
            


                                   
                }
            };