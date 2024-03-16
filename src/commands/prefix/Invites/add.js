        const { Message, PermissionFlagBits, EmbedBuilder,  } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Invites = require('../../../handlers/xata').getXataClient().db.Invites;
module.exports = {
    structure: {
        name: 'add-invites',
        description: 'Add Invites to a user',
        aliases: ["add-invite", "add-i", "addi", "add-inv"],
        permissions: "Administrator",
        category: "Invites"
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {

        if(!args[0] || isNaN(args[0]) ||args[0] < 0) return message.reply('Please provide a valid number');

        if(!args[1]) return message.reply('Please provide a user');

       
        const user = message.mentions.users.first() || await message.guild.members.fetch(args[1])
        if(!user) return message.reply('Please provide a valid user');

        let  Data = await Invites.filter({ Guild: message.guildId, Inviter: user.id  }).getFirst();

if(!Data) {
     await Invites.create({
        Guild: message.guildId,
        Inviter: user.id,
        Invites: 0,
    })
}

          Data.update({
            Invites: Data.Invites += parseInt(args[0])
                  })  
            message.reply(`Added ${args[0]} invites to <@${user.id}>`);

                                         
    }
};