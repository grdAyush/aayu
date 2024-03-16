        const { Message, PermissionFlagBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Invites = require('../../../handlers/xata').getXataClient().db.Invites;
const InviteBy = require("../../../handlers/xata").getXataClient().db.InviteBy;
module.exports = {
    structure: {
        name: 'reset-invites',
        description: "reset all or some user's Invite",
       aliases: ["reset-invite", "reset-i", "reseti", "reset-inv"],
        permissions: "Administrator",
        category: "Invites",
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        let bruh = await Invites.filter({ Guild: message.guildId }).getMany();
        let bruh2 = await InviteBy.filter({ Guild: message.guildId }).getMany();
     

        if(!args[0]) return message.reply({ embeds: [
            new EmbedBuilder()
                .setTitle('Command: Reset Invites')
                .setDescription("Usage: `reset-invites <user> or `reset-invites all`" )
                .setColor(client.color)
                
        ]});

        if(args[0] !== "all") {
          const user = message.mentions.users.first() ? message.mentions.users.first() :  await message.guild.members.fetch(args[0])
            if(!user) return message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle('Command: Reset Invites')
                    .setDescription("Usage: `reset-invites <user> or `reset-invites all`" )
                    .setColor(client.color)
                    
            ]});

            let  Data = await Invites.filter({ Guild: message.guildId, Inviter: user.id  }).getFirst();
            let Data2 = await InviteBy.filter({ Guild: message.guildId, Inviter: user.id }).getMany();

            if(Data2) { 
                for( const i of Data2) {
                    i.delete();    
                    }
            }

    if(!Data) {
       message.reply(`User does not have any invites`);

    }

Data.delete();
    message.reply(`Successfully resetted ${user.username}'s invites`);
        } else if(args[0] === "all") {
            const embed =  new EmbedBuilder()
            .setTitle('Command: Reset Invites')
            .setDescription(`Are You Sure You Want To Reset All Invites?`)
            .setColor(client.color)

            const Buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Success)
            )

            const msg = await message.reply({ embeds: [embed], components: [Buttons] });

            const filter = (interaction) => interaction.user.id === message.author.id;

            const collector =  msg.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (interaction) => {
                if(interaction.customId === 'yes') {
                   if(!bruh) return interaction.update(`There are no invites to reset`)
                   for( const i of bruh) {
                i.delete();    
                }
                for( const i of bruh2) {
                    i.delete();
                }
                    interaction.update({ embeds: [
                        new EmbedBuilder()
                            .setTitle('Command: Reset Invites')
                            .setDescription(`Successfully resetted all invites`)
                            .setColor(client.color)
                            
                    ], components: [] });
                
                } else if(interaction.customId === 'no') {
                    interaction.update({ embeds: [
                        new EmbedBuilder()
                            .setTitle('Command: Reset Invites')
                            .setDescription(`Cancelled`)
                            .setColor(client.color)
                            
                    ], components: [] });
                };
            });
        };
    },
};